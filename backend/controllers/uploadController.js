const Tenant = require("../models/TenantSupabase");
const supabase = require("../config/supabaseClient");
const fs = require("fs");
const path = require("path");

const uploadToSupabase = async (localPath, bucket, folder, filename, mimetype) => {
  const fileBuffer = fs.readFileSync(localPath);
  const destPath = `${folder}/${filename}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(destPath, fileBuffer, { contentType: mimetype, upsert: true });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(destPath);
  
  // Cleanup local
  fs.unlinkSync(localPath);

  return data.publicUrl;
};

exports.uploadAadhaar = async (req, res) => {
  try {
    const tenantId = req.params.tenantId;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const localPath = req.file.path;
    const finalPath = await uploadToSupabase(localPath, "documents", `tenant_${tenantId}`, `aadhaar_${Date.now()}${path.extname(localPath)}`, req.file.mimetype);

    await Tenant.findByIdAndUpdate(tenantId, {
      aadhaar_url: finalPath
    });

    res.json({ message: "Aadhaar uploaded", url: finalPath });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uploadAgreement = async (req, res) => {
  try {
    const tenantId = req.params.tenantId;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const localPath = req.file.path;
    const finalPath = await uploadToSupabase(localPath, "documents", `tenant_${tenantId}`, `agreement_${Date.now()}${path.extname(localPath)}`, req.file.mimetype);

    await Tenant.findByIdAndUpdate(tenantId, {
      agreement_url: finalPath
    });

    res.json({ message: "Agreement uploaded", url: finalPath });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uploadPropertyDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const localPath = req.file.path;
    const type = req.body.type || 'document'; // 'aadhaar' or 'agreement'
    const propertyId = req.body.propertyId || 'unknown_property';
    
    // We upload to property_documents folder in the documents bucket
    const finalPath = await uploadToSupabase(
      localPath, 
      "documents", 
      `property_documents/${propertyId}`, 
      `${type}_${Date.now()}${path.extname(localPath)}`, 
      req.file.mimetype
    );

    res.json({ message: "Document uploaded successfully", url: finalPath });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uploadFounderImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const localPath = req.file.path;
    const finalPath = await uploadToSupabase(
      localPath, 
      "documents", 
      "founders", 
      `founder_${Date.now()}${path.extname(localPath)}`, 
      req.file.mimetype
    );

    res.json({ message: "Founder image uploaded successfully", url: finalPath });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const localPath = req.file.path;
    const folder = req.body.folder || 'general';
    
    const finalPath = await uploadToSupabase(
      localPath, 
      "documents", 
      `images/${folder}`, 
      `image_${Date.now()}${path.extname(localPath)}`, 
      req.file.mimetype
    );

    res.json({ message: "Image uploaded successfully", url: finalPath });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};