// Supabase client and helper functions
// Conditionally require @supabase/supabase-js to prevent MODULE_NOT_FOUND errors
let createClient = null;
try {
  const supabaseModule = require("@supabase/supabase-js");
  createClient = supabaseModule.createClient;
} catch (error) {
  console.warn("[SUPABASE] ⚠️  @supabase/supabase-js package not found. Supabase features will be disabled.");
  console.warn("[SUPABASE] Install with: npm install @supabase/supabase-js");
}

// Get Supabase credentials from environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Create Supabase client with service role key (bypasses RLS)
let supabase = null;
if (createClient && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    console.log("[SUPABASE] ✅ Supabase client initialized");
  } catch (error) {
    console.error("[SUPABASE] ❌ Failed to initialize Supabase client:", error.message);
    console.warn("[SUPABASE] ⚠️  Using file-based storage as fallback.");
  }
} else {
  if (!createClient) {
    console.warn("[SUPABASE] ⚠️  @supabase/supabase-js not available. Using file-based storage.");
  } else if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("[SUPABASE] ⚠️  Supabase credentials not found. Using file-based storage.");
    console.warn("[SUPABASE] Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables to enable Supabase.");
  }
}

// Helper function to check if Supabase is available
function isSupabaseAvailable() {
  return supabase !== null;
}

// ================== CLINICS ==================
async function getClinicByCode(clinicCode) {
  if (!isSupabaseAvailable()) return null;
  try {
    const { data, error } = await supabase
      .from("clinics")
      .select("*")
      .eq("clinic_code", clinicCode.toUpperCase())
      .single();
    if (error) {
      console.error("[SUPABASE] Error getting clinic:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("[SUPABASE] Exception getting clinic:", error);
    return null;
  }
}

async function getAllClinics() {
  if (!isSupabaseAvailable()) return {};
  try {
    const { data, error } = await supabase.from("clinics").select("*");
    if (error) {
      console.error("[SUPABASE] Error getting all clinics:", error);
      return {};
    }
    // Convert array to object with clinic_code as key
    const clinicsObj = {};
    if (data) {
      data.forEach((clinic) => {
        clinicsObj[clinic.clinic_code] = clinic;
      });
    }
    return clinicsObj;
  } catch (error) {
    console.error("[SUPABASE] Exception getting all clinics:", error);
    return {};
  }
}

async function createClinic(clinicData) {
  if (!isSupabaseAvailable()) return null;
  try {
    const { data, error } = await supabase
      .from("clinics")
      .insert([clinicData])
      .select()
      .single();
    if (error) {
      console.error("[SUPABASE] Error creating clinic:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("[SUPABASE] Exception creating clinic:", error);
    return null;
  }
}

async function updateClinic(clinicCode, updates) {
  if (!isSupabaseAvailable()) return null;
  try {
    const { data, error } = await supabase
      .from("clinics")
      .update(updates)
      .eq("clinic_code", clinicCode.toUpperCase())
      .select()
      .single();
    if (error) {
      console.error("[SUPABASE] Error updating clinic:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("[SUPABASE] Exception updating clinic:", error);
    return null;
  }
}

// ================== PATIENTS ==================
async function getPatientById(patientId) {
  if (!isSupabaseAvailable()) return null;
  try {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("patient_id", patientId)
      .single();
    if (error) {
      console.error("[SUPABASE] Error getting patient:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("[SUPABASE] Exception getting patient:", error);
    return null;
  }
}

async function getPatientsByClinicCode(clinicCode) {
  if (!isSupabaseAvailable()) return [];
  try {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("clinic_code", clinicCode.toUpperCase());
    if (error) {
      console.error("[SUPABASE] Error getting patients by clinic:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("[SUPABASE] Exception getting patients by clinic:", error);
    return [];
  }
}

async function createPatient(patientData) {
  if (!isSupabaseAvailable()) return null;
  try {
    const { data, error } = await supabase
      .from("patients")
      .insert([patientData])
      .select()
      .single();
    if (error) {
      console.error("[SUPABASE] Error creating patient:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("[SUPABASE] Exception creating patient:", error);
    return null;
  }
}

async function updatePatient(patientId, updates) {
  if (!isSupabaseAvailable()) return null;
  try {
    const { data, error } = await supabase
      .from("patients")
      .update(updates)
      .eq("patient_id", patientId)
      .select()
      .single();
    if (error) {
      console.error("[SUPABASE] Error updating patient:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("[SUPABASE] Exception updating patient:", error);
    return null;
  }
}

module.exports = {
  isSupabaseAvailable,
  getClinicByCode,
  getAllClinics,
  createClinic,
  updateClinic,
  getPatientById,
  getPatientsByClinicCode,
  createPatient,
  updatePatient,
};

