export default defineNuxtRouteMiddleware(({ params: { type } }, _) => {
  const { DEFAULT, set } = useType()
  set(typeof type === 'string' ? (type as Type) : DEFAULT)
})
