const Tenant = require("../models/TenantSupabase");
const supabase = require("../config/supabaseClient");
const { sendSMS, sendWhatsApp, sendEmail } = require("../services/notificationService");

exports.sendRentReminders = async () => {
  try {
    const today = new Date();
    
    // Start of today: 00:00:00
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // End of 5 days later: 23:59:59
    const fiveDaysLater = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5);
    const endOfFiveDaysLater = new Date(fiveDaysLater.getFullYear(), fiveDaysLater.getMonth(), fiveDaysLater.getDate(), 23, 59, 59, 999);

    const startISO = startOfToday.toISOString();
    const endISO = endOfFiveDaysLater.toISOString();

    // Roll forward past due dates first
    // Note: SQL schemas might not have rentDueDay if rent_due_date handles it directly.
    // If they only have rent_due_date:
    const { data: pastTenants } = await supabase
      .from("tenants")
      .select("*")
      .lt("rent_due_date", startISO)
      .not("rent_due_date", "is", null);

    if (pastTenants) {
      for (const t of pastTenants) {
        // Roll forward to next month same day
        const oldDate = new Date(t.rent_due_date);
        let nextDue = new Date(startOfToday.getFullYear(), startOfToday.getMonth(), oldDate.getDate());
        if (nextDue < startOfToday) {
          nextDue.setMonth(nextDue.getMonth() + 1);
        }
        await Tenant.findByIdAndUpdate(t.id, { rent_due_date: nextDue.toISOString().split('T')[0] });
      }
    }

    // Find tenants whose rent is due in the next 5 days
    const { data: tenants } = await supabase
      .from("tenants")
      .select("*")
      .gte("rent_due_date", startISO)
      .lte("rent_due_date", endISO)
      .not("rent_amount", "is", null);

    if (tenants) {
      for (const tenant of tenants) {
        const dueDateStr = new Date(tenant.rent_due_date).toDateString();
        const message = `Hello ${tenant.name || "Tenant"}! Your rent of ₹${tenant.rent_amount} for SK Buildings is due on ${dueDateStr}. Please pay on time.`;

        if (tenant.phone) {
          await sendSMS(tenant.phone, message);
          await sendWhatsApp(tenant.phone, message);
        }

        if (tenant.email) {
          await sendEmail(tenant.email, "Rent Reminder", message);
        }
      }

      console.log(`[Rent Reminder Cron] Processed reminders. Sent to ${tenants.length} tenants.`);
      return tenants.length;
    }
    
    return 0;
  } catch (error) {
    console.error("Rent Reminder Error:", error.message);
    return 0;
  }
};