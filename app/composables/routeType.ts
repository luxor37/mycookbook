const routeType = ref<Route>("all");

export const useRouteType = () => {
  const get = () => routeType;
  const set = (route: Route) => (routeType.value = route);

  return {
    get,
    set,
  };
};
