import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/lib/auth";

// Safe debug check.
// Never print CLOUDINARY_API_SECRET itself.
console.log("Cloudinary config check:", {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  hasApiSecret: Boolean(
    process.env.CLOUDINARY_API_SECRET
  ),
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export async function POST(request: Request) {
  try {
    // Only logged-in customers can upload consultation photos.
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          message: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    // Make sure Cloudinary is configured.
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error(
        "Cloudinary environment variables are missing."
      );

      return NextResponse.json(
        {
          message: "Image upload is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          message: "No image was provided.",
        },
        {
          status: 400,
        }
      );
    }

    // Only allow supported image formats.
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          message:
            "Invalid image type. Please use JPG, PNG or WebP.",
        },
        {
          status: 400,
        }
      );
    }

    // Maximum file size: 8 MB.
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          message: "Image must be smaller than 8 MB.",
        },
        {
          status: 400,
        }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<{
      secure_url: string;
      public_id: string;
      width?: number;
      height?: number;
    }>((resolve, reject) => {
      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            folder:
              "brook-skincare/consultations",

            resource_type: "image",

            // Do not use customer name/email
            // in the Cloudinary filename.
            use_filename: false,
            unique_filename: true,
            overwrite: false,
          },
          (error, uploadResult) => {
            if (error || !uploadResult) {
              reject(
                error ??
                  new Error(
                    "Cloudinary did not return an upload result."
                  )
              );

              return;
            }

            resolve({
              secure_url:
                uploadResult.secure_url,

              public_id:
                uploadResult.public_id,

              width:
                uploadResult.width,

              height:
                uploadResult.height,
            });
          }
        );

      uploadStream.end(buffer);
    });

    console.log(
      "Cloudinary upload successful:",
      {
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      }
    );

    return NextResponse.json(
      {
        message:
          "Image uploaded successfully.",

        url: result.secure_url,

        publicId: result.public_id,

        width: result.width,

        height: result.height,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Cloudinary upload error:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to upload image.",
      },
      {
        status: 500,
      }
    );
  }
}