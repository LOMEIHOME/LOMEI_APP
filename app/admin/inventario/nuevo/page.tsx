import ProductForm from "@/components/admin/ProductForm";

export default function NuevoProductoPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl tracking-wider text-[var(--color-dark)]">
          Nuevo producto
        </h1>
        <p className="mt-1 text-sm text-[var(--color-warm-gray)]">
          Agrega un producto al inventario
        </p>
      </div>
      <ProductForm mode="create" />
    </div>
  );
}
