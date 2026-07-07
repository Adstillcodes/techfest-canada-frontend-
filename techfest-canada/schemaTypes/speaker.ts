// schemaTypes/speaker.ts
import { defineField, defineType } from "sanity";
import type { StringRule, NumberRule, ImageRule } from "sanity";

export default defineType({
    name: "speaker",
    title: "Speakers",
    type: "document",

    fields: [
        defineField({
            name: "name",
            title: "Full Name",
            type: "string",
            validation: (Rule: StringRule) => Rule.required().error("Speaker name is required."),
        }),
        defineField({
            name: "title",
            title: "Job Title",
            type: "string",
            description: "e.g. Chief Executive Officer",
            validation: (Rule: StringRule) => Rule.required().error("Job title is required."),
        }),
        defineField({
            name: "company",
            title: "Company",
            type: "string",
            description: "e.g. Shopify",
            validation: (Rule: StringRule) => Rule.required().error("Company is required."),
        }),
        defineField({
            name: "bio",
            title: "Bio",
            type: "text",
            rows: 4,
            description: "A short speaker bio shown on the card (2–3 sentences recommended).",
        }),
        defineField({
            name: "image",
            title: "Profile Photo",
            type: "image",
            options: { hotspot: true },
            validation: (Rule: ImageRule) => Rule.required().error("Profile photo is required."),
        }),

        // ── Ordering ──
        defineField({
            name: "order",
            title: "Display Order",
            type: "number",
            description: "Controls the order speakers appear. Lower numbers appear first.",
            validation: (Rule: NumberRule) => Rule.required().min(1).error("Display order is required."),
        }),
        defineField({
            name: "rowPosition",
            title: "Position in Row",
            type: "number",
            description:
                "Fine-tunes where this speaker sits within their row/group. Lower numbers appear first. Leave empty to fall back to Display Order.",
            validation: (Rule: NumberRule) =>
                Rule.min(1).integer().error("Position in row must be a whole number of 1 or more."),
        }),
        defineField({
            name: "featured",
            title: "Featured Speaker",
            type: "boolean",
            description: "Featured speakers are pinned to the top of the grid regardless of order.",
            initialValue: false,
        }),

        // ── Categorization (powers the frontend filters) ──
        defineField({
            name: "speakerType",
            title: "Speaker Type",
            type: "string",
            description: "Badge shown on the card, e.g. SPEAKER or KEYNOTE.",
            options: {
                list: [
                    { title: "Speaker", value: "speaker" },
                    { title: "Keynote", value: "keynote" },
                    { title: "Panelist", value: "panelist" },
                    { title: "Moderator", value: "moderator" },
                ],
                layout: "radio",
            },
            initialValue: "speaker",
        }),
        defineField({
            name: "techPillar",
            title: "Tech Pillar",
            type: "string",
            description: "Used by the Tech Pillar filter on the speakers page.",
            options: {
                list: [
                    { title: "Artificial Intelligence", value: "ai" },
                    { title: "Cybersecurity", value: "cybersecurity" },
                    { title: "Cloud & Data", value: "cloud-data" },
                    { title: "Emerging Tech", value: "emerging-tech" },
                ],
            },
        }),
        defineField({
            name: "sector",
            title: "Sector",
            type: "string",
            description: "Used by the Sector filter and shown as the tag on the card.",
            options: {
                list: [
                    { title: "Healthcare & Life Sci", value: "healthcare-life-sci" },
                    { title: "Manufacturing & Supply", value: "manufacturing-supply" },
                    { title: "Government & Public Sector", value: "government" },
                    { title: "Financial Services", value: "financial-services" },
                    { title: "Energy & Sustainability", value: "energy" },
                    { title: "Media & Entertainment", value: "media" },
                ],
            },
        }),

        // ── Optional social links ──
        defineField({
            name: "linkedin",
            title: "LinkedIn URL",
            type: "url",
            description: "Full URL e.g. https://linkedin.com/in/username",
        }),
        defineField({
            name: "twitter",
            title: "X / Twitter URL",
            type: "url",
            description: "Full URL e.g. https://x.com/username",
        }),
        defineField({
            name: "github",
            title: "GitHub URL",
            type: "url",
            description: "Full URL e.g. https://github.com/username",
        }),
        defineField({
            name: "website",
            title: "Personal Website URL",
            type: "url",
            description: "Full URL e.g. https://janedoe.com",
        }),
    ],

    // Preview in Studio list — photo + name + company
    preview: {
        select: {
            title: "name",
            subtitle: "company",
            media: "image",
        },
    },

    orderings: [
        {
            title: "Display Order",
            name: "orderAsc",
            by: [{ field: "order", direction: "asc" }],
        },
        {
            title: "Row Position",
            name: "rowPositionAsc",
            by: [
                { field: "order", direction: "asc" },
                { field: "rowPosition", direction: "asc" },
            ],
        },
        {
            title: "Name A–Z",
            name: "nameAsc",
            by: [{ field: "name", direction: "asc" }],
        },
    ],
});
