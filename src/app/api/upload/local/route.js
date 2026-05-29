import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";
import { existsSync } from "fs";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || "images";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const fileName = `${timestamp}_${safeName}`;

    const publicDir = join(process.cwd(), "public");
    const targetDir = join(publicDir, folder);

    if (!existsSync(targetDir)) {
      await mkdir(targetDir, { recursive: true });
    }

    const filePath = join(targetDir, fileName);
    await writeFile(filePath, buffer);

    const publicUrl = `/${folder}/${fileName}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
