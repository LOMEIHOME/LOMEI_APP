import { defineField, defineType } from "sanity";

export const producto = defineType({
  name: "producto",
  title: "Producto",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "string",
      options: {
        list: [
          { title: "Muebles", value: "Muebles" },
          { title: "Cojines & Textiles", value: "Cojines & Textiles" },
          { title: "Adornos", value: "Adornos" },
          { title: "Iluminación", value: "Iluminación" },
          { title: "Alfombras", value: "Alfombras" },
          { title: "Acabados", value: "Acabados" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Precio (MXN)",
      type: "number",
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "dimensions",
      title: "Dimensiones",
      type: "string",
    }),
    defineField({
      name: "materials",
      title: "Materiales",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "finishes",
      title: "Acabados disponibles",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "images",
      title: "Imágenes",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              title: "Texto alternativo",
              type: "string",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "badge",
      title: "Badge",
      type: "string",
      options: {
        list: [
          { title: "Ninguno", value: "" },
          { title: "Nuevo", value: "Nuevo" },
          { title: "Disponible", value: "Disponible" },
        ],
      },
    }),
  ],
  orderings: [
    {
      title: "Nombre A-Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
    {
      title: "Precio (menor a mayor)",
      name: "priceAsc",
      by: [{ field: "price", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category",
      media: "images.0",
    },
  },
});
