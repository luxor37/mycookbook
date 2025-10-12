export default defineNuxtRouteMiddleware(({ params: { category } }, _) => {
  useRouteType().set(
    typeof category === "string" ? (category as Route) : "all"
  );
});
