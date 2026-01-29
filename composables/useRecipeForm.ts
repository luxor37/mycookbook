import { object, string, type InferType, array } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { categories, type Category, type Ingredient } from "~/types/recipe";
import { useFractionNormalizer } from "~/composables/useFractionNormalizer";

const NETLIFY_FORM_NAME = "recipe-submissions";
type CategoryInput = Exclude<Category, "ALL">;

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .trim();

const defaultIngredient = (): Ingredient => ({
  name: "",
  quantity: "",
  unit: "",
});
const defaultInstruction = (): string => "";

const allowedCategories = Object.values(categories).filter(
  (item) => item !== categories.ALL,
) as CategoryInput[];

export const useRecipeForm = () => {
  const {
    public: { netlifyFormsEnabled },
  } = useRuntimeConfig();

  const formState = reactive<{
    title: string;
    category: CategoryInput;
    portions: string;
    time: string;
    tags: string[];
    image: string;
    source: string;
    notes: string;
    ingredients: Ingredient[];
    instructions: string[];
    botField: string;
  }>({
    title: "",
    category: categories.REPAS as CategoryInput,
    portions: "",
    time: "",
    tags: [] as string[],
    image: "",
    source: "",
    notes: "",
    ingredients: [defaultIngredient()],
    instructions: [defaultInstruction()],
    botField: "",
  });

  const units = ref(["tasse", "tsp", "tbsp", "lbs", "ml", "pincée"]);

  const { normalizeFractions } = useFractionNormalizer();

  const imageError = ref<string | null>(null);
  const imageName = ref<string | null>(null);

  const normalizeIngredientFraction = (index: number, value: string) => {
    const normalized = normalizeFractions(value);
    if (!formState.ingredients[index]) return;
    formState.ingredients[index].quantity = normalized;
    return normalized;
  };

  const isSubmitting = ref(false);
  const errorMessage = ref<string | null>(null);
  const responseMessage = ref<string | null>(null);
  const responseUrl = ref<string | null>(null);
  const warnings = ref<string[]>([]);

  const recipeId = computed(() => slugify(formState.title));

  const categorySelectOptions = computed(() =>
    allowedCategories.map((value) => ({ label: value, value })),
  );

  const ingredients = computed<Ingredient[]>(() =>
    formState.ingredients
      .map((ingredient) => ({
        name: ingredient.name.trim(),
        quantity: ingredient.quantity.trim(),
        unit: ingredient.unit.trim(),
      }))
      .filter(
        (ingredient) => ingredient.name || ingredient.quantity || ingredient.unit,
      ),
  );

  const instructions = computed<string[]>(() =>
    formState.instructions
      .map((step) => step.trim())
      .filter((step) => step.length > 0),
  );

  const buildPayload = () => ({
    id: recipeId.value || undefined,
    title: formState.title.trim(),
    category: formState.category,
    portions: formState.portions.trim(),
    time: formState.time.trim(),
    tags: formState.tags,
    ingredients: ingredients.value,
    instructions: instructions.value,
    image: formState.image.trim(),
    source: formState.source.trim(),
    notes: formState.notes.trim(),
  });

  const netlifyJson = computed(() => JSON.stringify(buildPayload(), null, 2));

  const stringField = (label: string) =>
    string().trim().required(`${label} requis`);

  const schema = object({
    title: stringField("Titre"),
    category: string()
      .oneOf(allowedCategories, "Catégorie invalide")
      .required("Catégorie requise"),
    portions: stringField("Portions"),
    time: stringField("Temps"),
    tagsInput: string().trim(),
    image: string().trim().required("Image requise"),
    source: string().trim(),
    notes: string().trim(),
    ingredients: array()
      .of(
        object({
          name: string().trim().required("Nom d'ingrédient requis"),
          quantity: string().trim().optional(),
          unit: string().trim().optional(),
        }),
      )
      .min(1, "Ajoute au moins un ingrédient"),
    instructions: array()
      .of(
        string()
          .transform((v) => (typeof v === "string" ? v.trim() : ""))
          .min(1, "Étape requise"),
      )
      .min(1, "Ajoute au moins une étape"),
    botField: string().trim(),
  });

  const resetForm = () => {
    formState.title = "";
    formState.category = categories.REPAS as CategoryInput;
    formState.portions = "";
    formState.time = "";
    formState.tags = [];
    formState.image = "";
    formState.ingredients = [defaultIngredient()];
    formState.instructions = [defaultInstruction()];
    formState.botField = "";
    imageError.value = null;
    imageName.value = null;
  };

  const readFileAsDataURL = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Impossible de lire le fichier"));
      reader.readAsDataURL(file);
    });

  const validateImageDimensions = (dataUrl: string, size = 500) =>
    new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        if (img.width === size && img.height === size) resolve();
        else reject(
          new Error(
            `L'image doit être ${size}px x ${size}px (actuel: ${img.width}x${img.height}).`,
          ),
        );
      };
      img.onerror = () => reject(new Error("Impossible de charger l'image."));
      img.src = dataUrl;
    });

  const setImageFromFile = async (file?: File | null) => {
    imageError.value = null;
    imageName.value = null;
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataURL(file);
      await validateImageDimensions(dataUrl, 500);
      formState.image = dataUrl;
      imageName.value = file.name;
    } catch (error) {
      imageError.value =
        error instanceof Error
          ? error.message
          : "Image invalide. Assure-toi qu'elle est en 500x500.";
      throw error;
    }
  };

  const onImageFileChange = async (list: FileList | File[] | null | undefined) => {
    const file = list && (list as FileList)[0] ? (list as FileList)[0] : null;
    try {
      await setImageFromFile(file);
    } catch (_error) {
      // error message already captured in imageError
    }
  };

  const formatIngredient = (ingredient: Ingredient) => {
    const parts = [ingredient.name];
    if (ingredient.quantity) parts.push(ingredient.quantity);
    if (ingredient.unit) parts.push(ingredient.unit);
    return parts.filter(Boolean).join(" ");
  };

  const sendToNetlifyForms = async (payload: ReturnType<typeof buildPayload>) => {
    if (!netlifyFormsEnabled) return;

    const body = new URLSearchParams({
      "form-name": NETLIFY_FORM_NAME,
      "bot-field": formState.botField,
      id: payload.id || "",
      title: payload.title,
      category: payload.category,
      portions: payload.portions,
      time: payload.time,
      tags: payload.tags.join(", "),
      image: payload.image,
      source: payload.source || "",
      notes: payload.notes || "",
      ingredients: payload.ingredients.map(formatIngredient).join("\n"),
      instructions: payload.instructions.join("\n"),
      json: JSON.stringify(payload),
    });

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!response.ok) {
        throw new Error("Netlify Forms a renvoyé une erreur.");
      }
    } catch (error) {
      warnings.value.push(
        "Capture Netlify Forms indisponible (souvent normal en local).",
      );
    }
  };

  const submitToFunction = async (payload: ReturnType<typeof buildPayload>) => {
    const response = await fetch("/.netlify/functions/submit-recipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result?.message || "Impossible d'envoyer la recette.");
    }

    return result;
  };

  const handleSubmit = async (
    _event: FormSubmitEvent<InferType<typeof schema>>,
  ) => {
    warnings.value = [];
    errorMessage.value = null;
    responseMessage.value = null;
    responseUrl.value = null;

    const payload = buildPayload();

    isSubmitting.value = true;

    try {
      await sendToNetlifyForms(payload);
      const result = await submitToFunction(payload);
      responseMessage.value =
        result?.message || "Suggestion envoyée avec succès.";
      responseUrl.value = result?.url || null;
      resetForm();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Une erreur est survenue.";
      errorMessage.value = message;
    } finally {
      isSubmitting.value = false;
    }
  };

  const onCreateUnit = (index: number, item: string) => {
    if (formState.ingredients[index]) formState.ingredients[index].unit = item;
    else return;

    units.value.push(item);
  };

  const addIngredient = () => {
    formState.ingredients.push(defaultIngredient());
  };

  const removeIngredient = (index: number) => {
    if (formState.ingredients.length === 1) return;
    formState.ingredients.splice(index, 1);
  };

  const addInstruction = () => {
    formState.instructions.push(defaultInstruction());
  };

  const removeInstruction = (index: number) => {
    if (formState.instructions.length === 1) return;
    formState.instructions.splice(index, 1);
  };

  return {
    formState,
    schema,
    recipeId,
    categorySelectOptions,
    netlifyJson,
    units,
    onCreateUnit,
    addIngredient,
    removeIngredient,
    addInstruction,
    removeInstruction,
    handleSubmit,
    isSubmitting,
    errorMessage,
    responseMessage,
    responseUrl,
    warnings,
    normalizeIngredientFraction,
    NETLIFY_FORM_NAME,
    imageError,
    imageName,
    onImageFileChange,
    setImageFromFile,
  };
};
