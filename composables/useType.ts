const DEFAULT = 'all' as Type
const type = ref<Type>(DEFAULT)

export const useType = () => ({
  DEFAULT,
  get: () => type,
  set: (route: Type) => (type.value = route),
})
