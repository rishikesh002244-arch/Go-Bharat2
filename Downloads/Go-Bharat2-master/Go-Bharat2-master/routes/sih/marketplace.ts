import { connectToDatabase } from "@/lib/mongodb";
import SIH_Artisan from "@/models/SIH_Artisan";
import SIH_Product from "@/models/SIH_Product";

export type MarketplaceProduct = {
  id: string;
  name: string;
  description: string;
  kind: "product" | "experience";
  category: string;
  price: number;
  currency: "INR";
  image: string;
  stockStatus: "in_stock" | "made_to_order" | "limited";
  sustainabilityNote: string;
  tags: string[];
  artisan: {
    id: string;
    name: string;
    craft: string;
    location: string;
    state: string;
    verified: boolean;
  };
};

type SeedEntry = Omit<MarketplaceProduct, "id" | "artisan"> & {
  artisan: MarketplaceProduct["artisan"];
};

const MARKETPLACE_SEED: SeedEntry[] = [
  {
    name: "Hand-block Printed Indigo Stole",
    description: "A naturally dyed cotton stole hand-printed with Bagru motifs by a family workshop.",
    kind: "product",
    category: "Textiles",
    price: 1450,
    currency: "INR",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80",
    stockStatus: "made_to_order",
    sustainabilityNote: "Natural dyes and small-batch production support a low-waste craft practice.",
    tags: ["Rajasthan", "Handloom", "Natural dyes"],
    artisan: {
      id: "bagru-indigo",
      name: "Meera Printers Collective",
      craft: "Bagru block printing",
      location: "Bagru",
      state: "Rajasthan",
      verified: true,
    },
  },
  {
    name: "Kondapalli Toy Carving Workshop",
    description: "A two-hour, hands-on toy-making session guided by a third-generation Kondapalli artisan.",
    kind: "experience",
    category: "Workshops",
    price: 950,
    currency: "INR",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
    stockStatus: "limited",
    sustainabilityNote: "Uses locally sourced softwood and keeps a heritage craft economically viable.",
    tags: ["Andhra Pradesh", "Workshop", "Family friendly"],
    artisan: {
      id: "kondapalli-toys",
      name: "Raju Naidu Studio",
      craft: "Kondapalli toys",
      location: "Kondapalli",
      state: "Andhra Pradesh",
      verified: true,
    },
  },
  {
    name: "Kashmiri Papier-mâché Keepsake Box",
    description: "A hand-painted keepsake box featuring traditional floral motifs from Srinagar.",
    kind: "product",
    category: "Home & decor",
    price: 2100,
    currency: "INR",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80",
    stockStatus: "in_stock",
    sustainabilityNote: "Handcrafted to order, with no industrial mass production.",
    tags: ["Kashmir", "Decor", "Heritage craft"],
    artisan: {
      id: "srinagar-papier-mache",
      name: "Amina Crafts",
      craft: "Papier-mâché",
      location: "Srinagar",
      state: "Jammu & Kashmir",
      verified: true,
    },
  },
  {
    name: "Bamboo Weaving Walk & Basket",
    description: "Meet the weavers, learn a simple pattern, and take home a hand-finished basket.",
    kind: "experience",
    category: "Workshops",
    price: 1200,
    currency: "INR",
    image: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=900&q=80",
    stockStatus: "limited",
    sustainabilityNote: "Bamboo is locally harvested and the visit directly funds village craft livelihoods.",
    tags: ["Assam", "Bamboo", "Community visit"],
    artisan: {
      id: "assam-bamboo",
      name: "Brahmaputra Weavers",
      craft: "Bamboo weaving",
      location: "Majuli",
      state: "Assam",
      verified: true,
    },
  },
];

function seedAsFallback(): MarketplaceProduct[] {
  return MARKETPLACE_SEED.map((entry) => ({
    ...entry,
    id: `demo-${entry.artisan.id}-${entry.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
  }));
}

async function ensureMarketplaceSeed() {
  const artisanBySeedId = new Map<string, string>();

  for (const entry of MARKETPLACE_SEED) {
    const artisan = await SIH_Artisan.findOneAndUpdate(
      { name: entry.artisan.name, location: entry.artisan.location },
      {
        $setOnInsert: {
          name: entry.artisan.name,
          craft: entry.artisan.craft,
          location: entry.artisan.location,
          state: entry.artisan.state,
          story: `${entry.artisan.name} preserves ${entry.artisan.craft} through locally led cultural tourism.`,
          image: entry.image,
          verified: entry.artisan.verified,
        },
      },
      { new: true, upsert: true }
    );
    artisanBySeedId.set(entry.artisan.id, artisan._id.toString());
  }

  for (const entry of MARKETPLACE_SEED) {
    const artisanId = artisanBySeedId.get(entry.artisan.id);
    if (!artisanId) continue;

    await SIH_Product.updateOne(
      { name: entry.name, artisanId },
      {
        $setOnInsert: {
          artisanId,
          name: entry.name,
          description: entry.description,
          kind: entry.kind,
          category: entry.category,
          price: entry.price,
          currency: entry.currency,
          image: entry.image,
          stockStatus: entry.stockStatus,
          sustainabilityNote: entry.sustainabilityNote,
          tags: entry.tags,
          active: true,
        },
      },
      { upsert: true }
    );
  }
}

export async function listMarketplaceProducts(search?: string) {
  const database = await connectToDatabase();
  if (!database) {
    return { products: filterProducts(seedAsFallback(), search), isFallback: true };
  }

  await ensureMarketplaceSeed();
  const query: Record<string, unknown> = { active: true };
  if (search?.trim()) {
    const pattern = new RegExp(search.trim(), "i");
    query.$or = [
      { name: pattern },
      { description: pattern },
      { category: pattern },
      { tags: pattern },
    ];
  }

  const products = await SIH_Product.find(query)
    .populate("artisanId", "name craft location state verified")
    .sort({ createdAt: -1 })
    .lean();

  return {
    products: products.map((product) => {
      const artisan = product.artisanId as unknown as {
        _id: { toString(): string };
        name: string;
        craft: string;
        location: string;
        state: string;
        verified: boolean;
      };
      return {
        id: product._id.toString(),
        name: product.name,
        description: product.description,
        kind: product.kind,
        category: product.category,
        price: product.price,
        currency: product.currency,
        image: product.image,
        stockStatus: product.stockStatus,
        sustainabilityNote: product.sustainabilityNote,
        tags: product.tags,
        artisan: {
          id: artisan._id.toString(),
          name: artisan.name,
          craft: artisan.craft,
          location: artisan.location,
          state: artisan.state,
          verified: artisan.verified,
        },
      } satisfies MarketplaceProduct;
    }),
    isFallback: false,
  };
}

function filterProducts(products: MarketplaceProduct[], search?: string) {
  if (!search?.trim()) return products;
  const query = search.trim().toLowerCase();
  return products.filter((product) =>
    [
      product.name,
      product.description,
      product.category,
      product.artisan.name,
      product.artisan.state,
      ...product.tags,
    ].some((value) => value.toLowerCase().includes(query))
  );
}
