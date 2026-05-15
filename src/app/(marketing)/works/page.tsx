import { listProducts } from "@/lib/products";
import { WorksClient } from "./works-client";

export default async function WorksPage() {
  const products = await listProducts();

  return <WorksClient initialProducts={products} />;
}
