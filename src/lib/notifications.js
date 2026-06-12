import { hasPermission } from "./accessControl.js";
import { createAccountInvitation } from "./accountInvitations.js";
import { emailShell, escapeEmailHtml, getEmailRuntime, queueAndAttemptEmail } from "./emailService.js";
import { listPublicUsers } from "./userStore.js";

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "")) && !String(email).endsWith(".invalid");
}

export async function enquiryNotificationRecipients() {
  const users = await listPublicUsers();
  return users.filter(
    (user) => user.status === "active" && user.notifyOnEnquiries !== false && validEmail(user.email) && hasPermission(user, "enquiries", "view")
  );
}

export async function notifyEnquiryUsers({ enquiry, origin, event = "new" }) {
  const runtime = await getEmailRuntime();
  if (!runtime.settings.enquiryNotificationsEnabled) return [];
  const recipients = await enquiryNotificationRecipients();
  if (!recipients.length) return [];
  const title = event === "reply" ? "New enquiry reply" : "New enquiry received";
  const url = `${origin}/admin/enquiries/${encodeURIComponent(enquiry.id)}`;
  const body = `<p style="line-height:1.7"><strong>${escapeEmailHtml(enquiry.fullName)}</strong> ${event === "reply" ? "replied to" : "submitted"} an enquiry.</p><p style="line-height:1.7">${escapeEmailHtml(enquiry.serviceInterest || enquiry.eventType || "General enquiry")}</p><p><a href="${escapeEmailHtml(url)}" style="display:inline-block;background:#20375b;color:#fff;padding:12px 18px;text-decoration:none">Open enquiry</a></p>`;
  const result = await queueAndAttemptEmail({
    type: event === "reply" ? "enquiry_reply_notification" : "enquiry_notification",
    to: recipients.map((user) => user.email),
    subject: `${title}: ${enquiry.fullName}`,
    text: `${title} from ${enquiry.fullName}. Open ${url}`,
    html: emailShell(title, body),
    relatedType: "enquiry",
    relatedId: enquiry.id
  });
  return result ? [result] : [];
}

export async function sendAccountInvitation(user, origin) {
  const runtime = await getEmailRuntime();
  if (!runtime.accountInvitationsAvailable || !validEmail(user.email)) return null;
  const token = await createAccountInvitation(user.id);
  const url = `${origin}/admin/activate-account?token=${encodeURIComponent(token)}`;
  const body = `<p style="line-height:1.7">Hello ${escapeEmailHtml(user.name)},</p><p style="line-height:1.7">An Ephata Concepts administration account has been created for you. Use the secure link below to choose your password and activate the account. This link expires in 48 hours.</p><p><a href="${escapeEmailHtml(url)}" style="display:inline-block;background:#20375b;color:#fff;padding:12px 18px;text-decoration:none">Activate account</a></p>`;
  return queueAndAttemptEmail({
    type: "account_invitation",
    to: user.email,
    subject: "Activate your Ephata Concepts account",
    text: `Activate your Ephata Concepts account: ${url}`,
    html: emailShell("Activate your account", body),
    relatedType: "user",
    relatedId: user.id
  });
}

export async function sendAccountCreatedNotice(user, origin) {
  const runtime = await getEmailRuntime();
  if (!runtime.ready || !validEmail(user.email)) return null;
  const url = `${origin}/admin/login`;
  const body = `<p style="line-height:1.7">Hello ${escapeEmailHtml(user.name)},</p><p style="line-height:1.7">An Ephata Concepts administration account has been created for you. Sign in with the credentials provided by your administrator, then change your password when prompted.</p><p><a href="${escapeEmailHtml(url)}" style="display:inline-block;background:#20375b;color:#fff;padding:12px 18px;text-decoration:none">Open administration</a></p>`;
  return queueAndAttemptEmail({
    type: "account_created",
    to: user.email,
    subject: "Your Ephata Concepts administration account",
    text: `Your Ephata Concepts administration account is ready. Sign in at ${url}`,
    html: emailShell("Your account is ready", body),
    relatedType: "user",
    relatedId: user.id
  });
}

export async function sendPasswordResetOtp(user, otp) {
  const body = `<p style="line-height:1.7">Hello ${escapeEmailHtml(user.name)},</p><p style="line-height:1.7">Use this one-time verification code to reset your administration password. It expires in 10 minutes.</p><p style="font-size:32px;font-weight:800;letter-spacing:.18em;color:#20375b">${escapeEmailHtml(otp)}</p><p style="line-height:1.7">If you did not request this reset, ignore this email.</p>`;
  return queueAndAttemptEmail({
    type: "password_reset_otp",
    to: user.email,
    subject: "Your Ephata password reset code",
    text: `Your password reset code is ${otp}. It expires in 10 minutes.`,
    html: emailShell("Password reset code", body),
    relatedType: "user",
    relatedId: user.id
  });
}

export async function sendEnquiryReply({ enquiry, message, conversationToken, origin }) {
  const url = `${origin}/enquiry/${encodeURIComponent(conversationToken)}`;
  const body = `<p style="line-height:1.7">Hello ${escapeEmailHtml(enquiry.fullName)},</p><div style="border-left:3px solid #cea157;padding:4px 0 4px 16px;white-space:pre-line;line-height:1.7">${escapeEmailHtml(message.body)}</div><p><a href="${escapeEmailHtml(url)}" style="display:inline-block;background:#20375b;color:#fff;padding:12px 18px;text-decoration:none">View and reply</a></p>`;
  return queueAndAttemptEmail({
    type: "enquiry_reply",
    to: enquiry.email,
    subject: `Re: ${enquiry.serviceInterest || "Your Ephata enquiry"}`,
    text: `${message.body}\n\nView and reply: ${url}`,
    html: emailShell("A reply from Ephata Concepts", body),
    relatedType: "enquiry",
    relatedId: enquiry.id,
    metadata: { messageId: message.id }
  });
}
