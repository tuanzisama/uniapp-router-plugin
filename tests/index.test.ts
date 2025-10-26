import { useUniRoute } from "../src";

const route = useUniRoute<["id"]>();

const route2 = useUniRoute<{
  /**
   * route2's id
   */
  id: string;
}>();

console.info(route.query.id);
console.info(route2.query.id);
