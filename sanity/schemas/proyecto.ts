import { defineField, defineType } from "sanity";

export const proyecto = defineType({
  name: "proyecto",
  title: "Proyecto",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "string",
      options: {
        list: [
          { title: "Residencial", value: "Residencial" },
          { title: "Comercial", value: "Comercial" },
          { title: "Interiorismo", value: "Interiorismo" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "Año",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Ubicación",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "area",
      title: "Área",
      type: "string",
      description: "Ej: 85 m²",
    }),
    defineField({
      name: "duration",
      title: "Duración",
      type: "string",
      description: "Ej: 3 meses",
    }),
    defineField({
      name: "materials",
      title: "Materiales principales",
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
      name: "featured",
      title: "Destacado",
      type: "boolean",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Año (reciente primero)",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "images.0",
    },
  },
});
