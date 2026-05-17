import { NextResponse } from "next/server";
import { getServerProduct } from "@/lib/server-store";

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: Props) {
  const { id } = await params;
  const product = await getServerProduct(id);

  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
