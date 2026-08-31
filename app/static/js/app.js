// Sanad AI - Enterprise Grounded Decision Engine
// Client-Side Controller & Interactivity with Full Bilingual (AR/EN) Support

let currentLanguage = "ar"; // 'ar' or 'en'
let currentDocument = "HR_Policy_2026_v4.pdf";
let currentPage = 1;
let totalPages = 84;
let zoomLevel = 1.0;

// Language Toggle & Translations
const translations = {
  ar: {
    langBtn: "English 🇬🇧",
    logoTitle: "Sanad AI / سَنَد الذكي",
    logoSub: "محرك القرارات الموثقة",
    navOverview: "🌐 نظرة عامة",
    navWorkspace: "📊 مساحة القرارات",
    navIngestion: "📂 مركز المستندات",
    navDiscrepancy: "⚖️ تدقيق الامتثال",
    btnLaunch: "فتح مساحة العمل",
    heroPill: "مدعوم بنماذج Gemini 2.0 وفهرسة المتجهات ChromaDB | امتناع موثق ومقيد بالأدلة",
    heroH1: `تحويل مئات الصفحات من اللوائح والعقود إلى <br/><span class="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">قرارات فورية وموثقة بالأدلة الحرفية.</span>`,
    heroSub: "مساعد ذكي للقرارات المؤسسية يحلل الوثائق والسياسات، يتحقق من الامتثال بالاستشهاد برقم الصفحة والفقرة، ويكتشف التعارضات القانونية ويولد خطوات تنفيذية.",
    btnDemo: "تجربة مساحة العمل التفاعلية",
    btnDiff: "تشغيل مقارنة وتدقيق العقود",
    
    // Landing Preview Card
    previewTitle: "معاينة القرار الفوري والموثق",
    previewBadge: "96.4% موثق",
    previewPage: "صفحة 18 من 84",
    previewVerdictTitle: "قرار الذكاء الاصطناعي",
    previewVerdictBadge: "معتمد بشروط",
    previewFinding: "طلب بدل الأجهزة يقع ضمن الحدود المسموحة بالبند 4.2، ولكن نظراً لتجاوزه 1,000 دولار، يشترط توقيع المدير التنفيذي قبل المعالجة المالية.",
    previewRiskDesc: "<strong>تنبيه تدقيق:</strong> يلزم إرفاق نموذج B-12 المعتمد لتفادي رفض الطلب آلياً.",
    previewCitation: "المرجع: صفحة 18، البند 4.2",
    previewLatency: "سرعة الاسترجاع: 84ms",
    
    // Workspace Translations
    modeLabel: "الوضع / Mode:",
    btnModeCompliance: "تدقيق الامتثال",
    btnModeExec: "ملخص تنفيذي",
    docViewerHead: "عارض نصوص المستند والأدلة",
    queryPlaceholder: "اطرح سؤالك حول الوثيقة (مثال: شروط الدفع، الإجازات، مكافأة نهاية الخدمة، بدل الأجهزة)...",
    btnEvaluate: "تقييم القرار",
    suggestedLabel: "أسئلة مقترحة:",
    chip1: "💻 بدل أجهزة $1,500",
    chip2: "💳 شروط الدفع Net-60",
    chip3: "⚖️ الإجازة ومكافأة نهاية الخدمة",
    verdictHead: "نتيجة التحقق والامتثال",
    findingHead: "النتيجة التنفيذية المباشرة",
    findingBody: "طلب بدل الأجهزة يقع ضمن الحدود المسموحة بالبند 4.2، ولكن نظراً لتجاوزه 1,000 دولار، يشترط توقيع المدير التنفيذي قبل المعالجة المالية.",
    citationTitle: "الاستشهاد الحرفي (صفحة 18، البند 4.2)",
    jumpDoc: "الانتقال للنص في المستند",
    riskTitle: "ملاحظة تدقيق هامة",
    riskDesc: "يشترط إرفاق نموذج B-12 الموقع من المدير التنفيذي لتفادي رفض الطلب آلياً من النظام المالي.",
    checklistHead: "قائمة الإجراءات المطلوبة للتنفيذ",
    checkItem1: "الحصول على توقيع المدير على نموذج B-12",
    checkItem2: "إرفاق الفواتير الأصلية المفصلة",
    verificationFooter: "التحقق: قاعدة متجهات ChromaDB",
    latencyIndicator: "سرعة الاسترجاع: 42ms",
    
    // Ingestion Translations
    statDocs: "إجمالي المستندات",
    statChunks: "المقاطع المفهرسة (Chunks)",
    statSpeed: "معدل سرعة الاسترجاع",
    statDb: "قاعدة المتجهات",
    uploadHead: "رفع وتضمين مستند جديد (لوائح، سياسات، عقود، بنك أسئلة)",
    uploadSub: "يدعم ملفات PDF و DOCX و TXT مع معالجة متقدمة للجداول واللغتين العربية والإنجليزية.",
    uploadBtn: "اختيار ملف من جهازك",
    pipelineTitle: "مراحل خط المعالجة الفوري:",
    pipelineStatus: "جاهز للفهرسة",
    pipeStage1: "1. استخراج النصوص (OCR) ✓",
    pipeStage2: "2. التقسيم الدلالي (Chunking) ✓",
    pipeStage3: "3. تضمينات Gemini Embeddings ✓",
    pipeStage4: "4. التخزين في ChromaDB ✓",
    catalogHead: "دليل الوثائق والمستندات المفهرسة",
    thDoc: "اسم المستند والنسخة",
    thCat: "التصنيف",
    thPages: "الصفحات",
    thChunks: "عدد المقاطع",
    thModel: "نموذج التضمين",
    thHealth: "درجة التوثيق",
    thActions: "الإجراءات",
    
    // Discrepancy Translations
    diffBaselineLabel: "السياسة المرجعية المعتمدة",
    diffTargetLabel: "عقد المورد المستهدف",
    btnRunAudit: "تشغيل التدقيق واكتشاف التناقضات",
    diffConflictTitle: "⚠️ تعارض حرج مكتشف (مخاطر مالية عالية)",
    diffConflictSeverity: "درجة الخطورة: عالية",
    diffConflictBody: "شروط دفع المورد (Net-30 يوماً) تخالف سياسة الشركة الإلزامية (Net-60 يوماً). غرامة التأخير (12% مركبة شهرياً) تتجاوز الحدود القانونية.",
    btnGenAmendment: "توليد بند بديل متوافق نظامياً مع سياسة الشركة",
    clauseCmp1: "مقارنة البند #1: شروط الدفع والغرامات",
    clauseBadge1: "غير متوافق",
    clauseBaseTitle1: "السياسة المعتمدة (البند 3.2)",
    clauseBaseBody1: `"يجب أن تكون شروط الدفع Net-60 يوماً من تاريخ الفاتورة. غرامة الإنهاء المبكر محددة بـ 5% كحد أقصى."`,
    clauseTargetTitle1: "عقد المورد (البند 8.4)",
    clauseTargetBody1: `"شروط الدفع: Net-30 يوماً حصراً. تفرض غرامة تأخير بنسبة 12% شهرياً."`,
    clauseCmp2: "مقارنة البند #2: سقف المسؤولية القانونية",
    clauseBadge2: "مسؤولية غير مقيدة",
    clauseBaseTitle2: "السياسة المعتمدة (البند 3.3)",
    clauseBaseBody2: `"لا يجوز أن تتجاوز المسؤولية القصوى إجمالي قيمة العقد المدفوعة خلال الـ 12 شهراً السابقة."`,
    clauseTargetTitle2: "عقد المورد (البند 9.1)",
    clauseTargetBody2: `"تظل مسؤولية المورد غير محددة لسقف مالي في حالات الإهمال أو توقف الخدمة لأكثر من 4 ساعات."`,
    diffScoreTitle: "نظرة عامة على الامتثال",
    diffGaugeLabel: "نسبة التوافق",
    breakdown1: "بنود متوافقة ومعتمدة",
    breakdown2: "تعارضات عالية الخطورة",
    breakdown3: "بنود بحاجة لتوضيح",
    exportTitle: "تصدير تقرير التدقيق",
    btnPdf: "📄 تقرير PDF",
    btnJson: "💾 بيانات JSON",
    
    // Modal Translations
    modalTitle: "البند البديل المتوافق نظامياً مع السياسة",
    modalConflictLabel: "التعارض الحالي:",
    modalConflictText: "شروط دفع 30 يوماً مع غرامة 12% مركبة",
    modalAmendLabel: "✨ الصياغة القانونية البديلة المقترحة:",
    modalAmendText: `"البند 8.4 (معدل): يتم سداد مستحقات المورد خلال ستين (60) يوماً من تاريخ استلام الفاتورة المعتمدة (Net-60). في حال وجود نزاع حول مبالغ محددة، تتم معالجة المبالغ غير المتنازع عليها دون فرض أي غرامات تأخير."`,
    modalBtnClose: "إغلاق",
    modalBtnCopy: "📋 نسخ البند"
  },
  en: {
    langBtn: "العربية 🇦🇪",
    logoTitle: "Sanad AI",
    logoSub: "Grounded Decision Engine",
    navOverview: "🌐 Overview",
    navWorkspace: "📊 Decision Workspace",
    navIngestion: "📂 Knowledge Pipeline",
    navDiscrepancy: "⚖️ Compliance Diff",
    btnLaunch: "Launch Workspace",
    heroPill: "Powered by Gemini 2.0 & Chroma Vector Grounding | Measured Abstention & Evidence-Constrained",
    heroH1: `Turn Complex Organizational Policies & Contracts into <br/><span class="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">Instant, Grounded Decisions.</span>`,
    heroSub: "An enterprise-grade Decision Assistant that parses 100+ page documents, verifies compliance with exact page citations, detects policy conflicts, and generates actionable next steps.",
    btnDemo: "Try Interactive Live Demo",
    btnDiff: "Run Policy vs Contract Diff",
    
    // Landing Preview Card
    previewTitle: "Live Decision Preview",
    previewBadge: "96.4% Grounded",
    previewPage: "Page 18 of 84",
    previewVerdictTitle: "AI Decision Verdict",
    previewVerdictBadge: "Approved w/ Conditions",
    previewFinding: "Hardware claim is permissible under Section 4.2. Because it exceeds $1,000, secondary Director countersignature is required prior to financial disbursement.",
    previewRiskDesc: "<strong>Process Blocker:</strong> Countersigned Form B-12 must be attached to avoid automated system rejection.",
    previewCitation: "Citation: Page 18, Sec 4.2",
    previewLatency: "Latency: 84ms",
    
    // Workspace Translations
    modeLabel: "Mode:",
    btnModeCompliance: "Compliance Audit",
    btnModeExec: "Executive Summary",
    docViewerHead: "Document Evidence Viewer",
    queryPlaceholder: "Ask a question about this document (e.g. tech stipend, payment terms, annual leave)...",
    btnEvaluate: "Evaluate",
    suggestedLabel: "Suggested:",
    chip1: "💻 $1,500 Tech Stipend",
    chip2: "💳 Net-60 Payment Terms",
    chip3: "⚖️ Annual Leave & Gratuity",
    verdictHead: "VERIFICATION & COMPLIANCE RESULT",
    findingHead: "Executive Finding",
    findingBody: "The hardware reimbursement claim is permissible under Section 4.2. However, because it exceeds $1,000, secondary Director countersignature is structurally mandated before final processing.",
    citationTitle: "Source Verbatim (Page 18, Section 4.2)",
    jumpDoc: "Jump to Document",
    riskTitle: "Process Blocker Detected",
    riskDesc: "Director approval required. Countersigned Form B-12 must be attached to avoid automated financial rejection.",
    checklistHead: "Required Action Checklist",
    checkItem1: "Obtain Director countersignature on Form B-12",
    checkItem2: "Attach itemized original invoices",
    verificationFooter: "Grounding: ChromaDB Local Vector Store",
    latencyIndicator: "Retrieval Latency: 42ms",
    
    // Ingestion Translations
    statDocs: "Total Documents",
    statChunks: "Total Chunks",
    statSpeed: "Avg Retrieval Latency",
    statDb: "Vector Database",
    uploadHead: "Upload & Ingest New Document (Policies, Contracts, Questions)",
    uploadSub: "Supports PDF, DOCX, and TXT with advanced table extraction and Arabic/English language parsing.",
    uploadBtn: "Browse File from Device",
    pipelineTitle: "Active Pipeline Stages:",
    pipelineStatus: "Ready for Ingestion",
    pipeStage1: "1. Text Extraction (OCR) ✓",
    pipeStage2: "2. Semantic Chunking ✓",
    pipeStage3: "3. Gemini Embeddings ✓",
    pipeStage4: "4. ChromaDB Storage ✓",
    catalogHead: "Indexed Documents Catalog",
    thDoc: "Document Name & Version",
    thCat: "Category",
    thPages: "Pages",
    thChunks: "Chunks",
    thModel: "Embedding Model",
    thHealth: "Grounding Health",
    thActions: "Actions",
    
    // Discrepancy Translations
    diffBaselineLabel: "Baseline Corporate Policy",
    diffTargetLabel: "Target Vendor Contract",
    btnRunAudit: "Run Deep AI Discrepancy Audit",
    diffConflictTitle: "⚠️ Critical Conflict Detected (High Financial Risk)",
    diffConflictSeverity: "Severity: High",
    diffConflictBody: "Vendor payment terms (Net-30 days) violate corporate baseline policy (Net-60 days). Late surcharge of 12% monthly exceeds legal limit.",
    btnGenAmendment: "Generate Compliant Replacement Clause",
    clauseCmp1: "Clause #1 Comparison: Payment Terms & Surcharges",
    clauseBadge1: "Non-Compliant",
    clauseBaseTitle1: "Baseline Policy (Section 3.2)",
    clauseBaseBody1: `"Payment Terms must strictly be Net-60 days from invoice date. Early termination fee is capped at 5% maximum."`,
    clauseTargetTitle1: "Vendor Contract (Clause 8.4)",
    clauseTargetBody1: `"Payment Terms: Net-30 days exclusively. A late surcharge of 12% per month will apply."`,
    clauseCmp2: "Clause #2 Comparison: Legal Liability Limitation",
    clauseBadge2: "Uncapped Liability",
    clauseBaseTitle2: "Baseline Policy (Section 3.3)",
    clauseBaseBody2: `"Maximum aggregate liability shall not exceed total contract value paid in the preceding 12 months."`,
    clauseTargetTitle2: "Vendor Contract (Clause 9.1)",
    clauseTargetBody2: `"Vendor liability remains uncapped in cases of gross negligence or service downtime exceeding 4 hours."`,
    diffScoreTitle: "Compliance Overview",
    diffGaugeLabel: "Policy Alignment",
    breakdown1: "Compliant & Verified Clauses",
    breakdown2: "High-Risk Conflicts",
    breakdown3: "Clauses Requiring Clarification",
    exportTitle: "Export Compliance Audit",
    btnPdf: "📄 PDF Report",
    btnJson: "💾 JSON Data",
    
    // Modal Translations
    modalTitle: "Policy-Compliant Replacement Clause",
    modalConflictLabel: "Current Identified Conflict:",
    modalConflictText: "Net-30 days payment terms with 12% monthly compound surcharge",
    modalAmendLabel: "✨ Recommended Compliant Legal Clause:",
    modalAmendText: `"Clause 8.4 (Amended): Payment shall be executed by Client within sixty (60) calendar days from receipt of a verified invoice (Net-60). In case of dispute over specific line items, undisputed portions shall be processed without accrual of penalties."`,
    modalBtnClose: "Close",
    modalBtnCopy: "📋 Copy Clause"
  }
};

function toggleLanguage() {
  currentLanguage = currentLanguage === "ar" ? "en" : "ar";
  const html = document.getElementById("html-root");
  html.setAttribute("lang", currentLanguage);
  html.setAttribute("dir", currentLanguage === "ar" ? "rtl" : "ltr");

  const t = translations[currentLanguage];
  
  // Navbar
  document.getElementById("lang-btn-text").innerText = t.langBtn;
  document.getElementById("txt-logo-title").innerText = t.logoTitle;
  document.getElementById("txt-logo-sub").innerText = t.logoSub;
  document.getElementById("txt-nav-overview").innerText = t.navOverview;
  document.getElementById("txt-nav-workspace").innerText = t.navWorkspace;
  document.getElementById("txt-nav-ingestion").innerText = t.navIngestion;
  document.getElementById("txt-nav-discrepancy").innerText = t.navDiscrepancy;
  document.getElementById("txt-btn-launch").innerText = t.btnLaunch;
  
  // Hero
  document.getElementById("txt-hero-pill").innerText = t.heroPill;
  document.getElementById("txt-hero-h1").innerHTML = t.heroH1;
  document.getElementById("txt-hero-sub").innerText = t.heroSub;
  document.getElementById("txt-btn-demo").innerText = t.btnDemo;
  document.getElementById("txt-btn-diff").innerText = t.btnDiff;
  
  // Landing Preview Card
  document.getElementById("txt-preview-title").innerText = t.previewTitle;
  const badgeSpan = document.querySelector("#txt-preview-badge span:last-child");
  if (badgeSpan) badgeSpan.innerText = t.previewBadge;
  const prevPage = document.getElementById("txt-preview-page");
  if (prevPage) prevPage.innerText = t.previewPage;
  const prevVTitle = document.getElementById("txt-preview-verdict-title");
  if (prevVTitle) prevVTitle.innerText = t.previewVerdictTitle;
  const prevVBadge = document.getElementById("txt-preview-verdict-badge");
  if (prevVBadge) prevVBadge.innerText = t.previewVerdictBadge;
  const prevFind = document.getElementById("txt-preview-finding");
  if (prevFind) prevFind.innerText = t.previewFinding;
  const prevRisk = document.getElementById("txt-preview-risk-desc");
  if (prevRisk) prevRisk.innerHTML = t.previewRiskDesc;
  const prevCite = document.getElementById("txt-preview-citation");
  if (prevCite) prevCite.innerText = t.previewCitation;
  const prevLat = document.getElementById("txt-preview-latency");
  if (prevLat) prevLat.innerText = t.previewLatency;

  // Workspace Translations
  const modeLbl = document.getElementById("txt-mode-label");
  if (modeLbl) modeLbl.innerText = t.modeLabel;
  const btnModeComp = document.getElementById("txt-btn-mode-compliance");
  if (btnModeComp) btnModeComp.innerText = t.btnModeCompliance;
  const btnModeEx = document.getElementById("txt-btn-mode-exec");
  if (btnModeEx) btnModeEx.innerText = t.btnModeExec;
  
  document.getElementById("txt-doc-viewer-head").innerText = t.docViewerHead;
  const qInput = document.getElementById("workspace-query-input");
  if (qInput) qInput.setAttribute("placeholder", t.queryPlaceholder);
  document.getElementById("txt-btn-evaluate").innerText = t.btnEvaluate;
  
  const suggLbl = document.getElementById("txt-suggested-label");
  if (suggLbl) suggLbl.innerText = t.suggestedLabel;
  const chip1 = document.getElementById("txt-chip-1");
  if (chip1) chip1.innerText = t.chip1;
  const chip2 = document.getElementById("txt-chip-2");
  if (chip2) chip2.innerText = t.chip2;
  const chip3 = document.getElementById("txt-chip-3");
  if (chip3) chip3.innerText = t.chip3;
  
  const vHead = document.getElementById("txt-verdict-head");
  if (vHead) vHead.innerText = t.verdictHead;
  document.getElementById("decision-confidence-badge").innerText = `⚡ ${t.previewBadge}`;
  document.getElementById("decision-verdict-badge").innerText = t.previewVerdictBadge;
  document.getElementById("txt-card-finding").innerText = t.findingHead;
  document.getElementById("decision-summary-text").innerText = t.findingBody;
  document.getElementById("citation-header-title").innerText = t.citationTitle;
  const jumpD = document.getElementById("txt-jump-doc");
  if (jumpD) jumpD.innerText = t.jumpDoc;
  document.getElementById("risk-title-text").innerText = t.riskTitle;
  document.getElementById("risk-desc-text").innerText = t.riskDesc;
  document.getElementById("txt-card-checklist").innerText = t.checklistHead;
  const cItem1 = document.getElementById("txt-check-item-1");
  if (cItem1) cItem1.innerText = t.checkItem1;
  const cItem2 = document.getElementById("txt-check-item-2");
  if (cItem2) cItem2.innerText = t.checkItem2;
  const vFoot = document.getElementById("txt-verification-footer");
  if (vFoot) vFoot.innerText = t.verificationFooter;
  document.getElementById("latency-indicator").innerText = t.latencyIndicator;

  // Ingestion Translations
  const sDocs = document.getElementById("txt-stat-docs");
  if (sDocs) sDocs.innerText = t.statDocs;
  const sChunks = document.getElementById("txt-stat-chunks");
  if (sChunks) sChunks.innerText = t.statChunks;
  const sSpeed = document.getElementById("txt-stat-speed");
  if (sSpeed) sSpeed.innerText = t.statSpeed;
  const sDb = document.getElementById("txt-stat-db");
  if (sDb) sDb.innerText = t.statDb;
  const uHead = document.getElementById("txt-upload-head");
  if (uHead) uHead.innerText = t.uploadHead;
  const uSub = document.getElementById("txt-upload-sub");
  if (uSub) uSub.innerText = t.uploadSub;
  const uBtn = document.getElementById("txt-upload-btn");
  if (uBtn) uBtn.innerText = t.uploadBtn;
  const pTitle = document.getElementById("txt-pipeline-title");
  if (pTitle) pTitle.innerText = t.pipelineTitle;
  const pStage1 = document.getElementById("txt-pipe-stage-1");
  if (pStage1) pStage1.innerText = t.pipeStage1;
  const pStage2 = document.getElementById("txt-pipe-stage-2");
  if (pStage2) pStage2.innerText = t.pipeStage2;
  const pStage3 = document.getElementById("txt-pipe-stage-3");
  if (pStage3) pStage3.innerText = t.pipeStage3;
  const pStage4 = document.getElementById("txt-pipe-stage-4");
  if (pStage4) pStage4.innerText = t.pipeStage4;
  const catHead = document.getElementById("txt-catalog-head");
  if (catHead) catHead.innerText = t.catalogHead;
  
  const thDoc = document.getElementById("th-doc");
  if (thDoc) thDoc.innerText = t.thDoc;
  const thCat = document.getElementById("th-cat");
  if (thCat) thCat.innerText = t.thCat;
  const thPages = document.getElementById("th-pages");
  if (thPages) thPages.innerText = t.thPages;
  const thChunks = document.getElementById("th-chunks");
  if (thChunks) thChunks.innerText = t.thChunks;
  const thModel = document.getElementById("th-model");
  if (thModel) thModel.innerText = t.thModel;
  const thHealth = document.getElementById("th-health");
  if (thHealth) thHealth.innerText = t.thHealth;
  const thActions = document.getElementById("th-actions");
  if (thActions) thActions.innerText = t.thActions;

  // Discrepancy Translations
  const diffBase = document.getElementById("txt-diff-baseline-label");
  if (diffBase) diffBase.innerText = t.diffBaselineLabel;
  const diffTarg = document.getElementById("txt-diff-target-label");
  if (diffTarg) diffTarg.innerText = t.diffTargetLabel;
  const btnAudit = document.getElementById("txt-btn-run-audit");
  if (btnAudit) btnAudit.innerText = t.btnRunAudit;
  const diffCTitle = document.getElementById("txt-diff-conflict-title");
  if (diffCTitle) diffCTitle.innerHTML = `<span>⚠️</span> ${t.diffConflictTitle}`;
  const diffCSeverity = document.getElementById("txt-diff-conflict-severity");
  if (diffCSeverity) diffCSeverity.innerText = t.diffConflictSeverity;
  const diffCBody = document.getElementById("txt-diff-conflict-body");
  if (diffCBody) diffCBody.innerText = t.diffConflictBody;
  const btnAmend = document.getElementById("txt-btn-gen-amendment");
  if (btnAmend) btnAmend.innerText = t.btnGenAmendment;
  
  const cCmp1 = document.getElementById("txt-clause-cmp-1");
  if (cCmp1) cCmp1.innerText = t.clauseCmp1;
  const cBadge1 = document.getElementById("txt-clause-badge-1");
  if (cBadge1) cBadge1.innerText = t.clauseBadge1;
  const cBaseT1 = document.getElementById("txt-clause-base-title-1");
  if (cBaseT1) cBaseT1.innerText = t.clauseBaseTitle1;
  const cBaseB1 = document.getElementById("txt-clause-base-body-1");
  if (cBaseB1) cBaseB1.innerText = t.clauseBaseBody1;
  const cTargT1 = document.getElementById("txt-clause-target-title-1");
  if (cTargT1) cTargT1.innerText = t.clauseTargetTitle1;
  const cTargB1 = document.getElementById("txt-clause-target-body-1");
  if (cTargB1) cTargB1.innerText = t.clauseTargetBody1;

  const cCmp2 = document.getElementById("txt-clause-cmp-2");
  if (cCmp2) cCmp2.innerText = t.clauseCmp2;
  const cBadge2 = document.getElementById("txt-clause-badge-2");
  if (cBadge2) cBadge2.innerText = t.clauseBadge2;
  const cBaseT2 = document.getElementById("txt-clause-base-title-2");
  if (cBaseT2) cBaseT2.innerText = t.clauseBaseTitle2;
  const cBaseB2 = document.getElementById("txt-clause-base-body-2");
  if (cBaseB2) cBaseB2.innerText = t.clauseBaseBody2;
  const cTargT2 = document.getElementById("txt-clause-target-title-2");
  if (cTargT2) cTargT2.innerText = t.clauseTargetTitle2;
  const cTargB2 = document.getElementById("txt-clause-target-body-2");
  if (cTargB2) cTargB2.innerText = t.clauseTargetBody2;

  const dScoreT = document.getElementById("txt-diff-score-title");
  if (dScoreT) dScoreT.innerText = t.diffScoreTitle;
  const dGaugeL = document.getElementById("txt-diff-gauge-label");
  if (dGaugeL) dGaugeL.innerText = t.diffGaugeLabel;
  const bDown1 = document.getElementById("txt-breakdown-1");
  if (bDown1) bDown1.innerHTML = `<span>✓</span> ${t.breakdown1}`;
  const bDown2 = document.getElementById("txt-breakdown-2");
  if (bDown2) bDown2.innerHTML = `<span>⚠️</span> ${t.breakdown2}`;
  const bDown3 = document.getElementById("txt-breakdown-3");
  if (bDown3) bDown3.innerHTML = `<span>ℹ️</span> ${t.breakdown3}`;
  const expT = document.getElementById("txt-export-title");
  if (expT) expT.innerText = t.exportTitle;
  const bPdf = document.getElementById("txt-btn-pdf");
  if (bPdf) bPdf.innerText = t.btnPdf;
  const bJson = document.getElementById("txt-btn-json");
  if (bJson) bJson.innerText = t.btnJson;

  // Modal Translations
  const mTitle = document.getElementById("txt-modal-title");
  if (mTitle) mTitle.innerHTML = `<span>✨</span> ${t.modalTitle}`;
  const mConfLbl = document.getElementById("txt-modal-conflict-label");
  if (mConfLbl) mConfLbl.innerText = t.modalConflictLabel;
  const mConfTxt = document.getElementById("txt-modal-conflict-text");
  if (mConfTxt) mConfTxt.innerText = t.modalConflictText;
  const mAmendLbl = document.getElementById("txt-modal-amend-label");
  if (mAmendLbl) mAmendLbl.innerText = t.modalAmendLabel;
  const mAmendTxt = document.getElementById("amendment-result-text");
  if (mAmendTxt) mAmendTxt.innerText = t.modalAmendText;
  const mBtnClose = document.getElementById("txt-modal-btn-close");
  if (mBtnClose) mBtnClose.innerText = t.modalBtnClose;
  const mBtnCopy = document.getElementById("txt-modal-btn-copy");
  if (mBtnCopy) mBtnCopy.innerHTML = `<span>📋</span> <span>${t.modalBtnCopy}</span>`;

  // Refresh current document view
  onWorkspaceDocChange(currentPage);
}

// Tab Navigation
function switchTab(tabName) {
  document.querySelectorAll(".view-panel").forEach(panel => {
    panel.classList.add("hidden");
  });
  document.querySelectorAll(".nav-tab").forEach(tab => {
    tab.classList.remove("text-amber-400", "bg-[#262a33]");
    tab.classList.add("text-gray-400");
  });

  const targetPanel = document.getElementById(`view-${tabName}`);
  if (targetPanel) {
    targetPanel.classList.remove("hidden");
  }

  const activeTab = document.getElementById(`nav-${tabName}`);
  if (activeTab) {
    activeTab.classList.remove("text-gray-400");
    activeTab.classList.add("text-amber-400", "bg-[#262a33]");
  }

  if (tabName === "ingestion") {
    loadDocumentsCatalog();
  }
}

// Dynamic Document Viewer with real page loading
async function onWorkspaceDocChange(pageNumber = 1) {
  const select = document.getElementById("workspace-doc-select");
  currentDocument = select.value;
  currentPage = pageNumber;
  document.getElementById("decision-doc-title").innerText = currentDocument;
  
  const canvas = document.getElementById("doc-viewer-canvas");
  const pageIndicator = document.getElementById("doc-page-indicator");

  pageIndicator.innerText = currentLanguage === "ar" ? `الصفحة ${currentPage}` : `Page ${currentPage}`;
  canvas.innerHTML = `<div class="text-center py-8 text-gray-500 text-xs">${currentLanguage === 'ar' ? 'جاري تحميل صفحة المستند...' : 'Loading document page...'}</div>`;

  try {
    const res = await fetch(`/api/documents/${encodeURIComponent(currentDocument)}/page/${currentPage}`);
    if (!res.ok) throw new Error("Failed to load page");
    const data = await res.json();
    
    totalPages = data.total_pages || 1;
    pageIndicator.innerText = currentLanguage === "ar" 
      ? `الصفحة ${data.page_number} من ${totalPages}` 
      : `Page ${data.page_number} of ${totalPages}`;

    const textContent = data.text || (currentLanguage === 'ar' ? "لا يوجد نص في هذه الصفحة." : "No text on this page.");
    const isAr = /[\u0600-\u06FF]/.test(textContent);
    const evidenceHead = currentLanguage === 'ar' ? 'النص الموثق من الصفحة المسترجعة:' : 'Grounded Evidence from Page:';
    const docTag = currentLanguage === 'ar' ? 'وثيقة رسمية موثقة' : 'CONFIDENTIAL // VERIFIED';

    canvas.setAttribute("dir", isAr ? "rtl" : "ltr");
    canvas.innerHTML = `
      <div class="border-b border-white/5 pb-2 text-[10px] text-gray-500 uppercase flex items-center justify-between">
        <span>${escapeHtml(currentDocument)}</span>
        <span>${docTag}</span>
      </div>
      <div id="citation-highlight-box" class="bg-amber-500/15 ${isAr ? 'border-r-4' : 'border-l-4'} border-amber-500 p-4 rounded text-amber-100 transition-all leading-relaxed whitespace-pre-wrap font-sans text-xs">
        <p class="font-bold text-amber-300 text-[11px] mb-2 flex items-center gap-1">
          <span>⚡</span> ${evidenceHead}
        </p>
        <p class="text-gray-200">${escapeHtml(textContent)}</p>
      </div>
    `;
  } catch (err) {
    console.error("Page load error:", err);
    canvas.innerHTML = `<div class="text-rose-400 text-xs p-4">${currentLanguage === 'ar' ? 'تعذر تحميل الصفحة المحددة.' : 'Failed to load specified page.'}</div>`;
  }
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function zoomDoc(delta) {
  zoomLevel = Math.max(0.8, Math.min(1.4, zoomLevel + delta * 0.1));
  const canvas = document.getElementById("doc-viewer-canvas");
  canvas.style.transform = `scale(${zoomLevel})`;
  canvas.style.transformOrigin = currentLanguage === "ar" ? "top right" : "top left";
}

function setQuery(text) {
  const input = document.getElementById("workspace-query-input");
  input.value = text;
  runWorkspaceQuery();
}

// Execute Decision Query
async function runWorkspaceQuery() {
  const input = document.getElementById("workspace-query-input");
  const query = input.value.trim();
  if (!query) return;

  const btn = document.querySelector("#workspace-query-input + button");
  if (btn) btn.innerHTML = `<span>⏳ جاري التحليل...</span>`;

  try {
    const res = await fetch("/api/workspace/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        document_id: currentDocument,
        query: query,
        mode: "compliance"
      })
    });

    if (!res.ok) throw new Error("API request failed");
    const data = await res.json();
    renderDecisionCard(data);
  } catch (err) {
    console.error("Query error:", err);
  } finally {
    if (btn) btn.innerHTML = `<span>${currentLanguage === 'ar' ? 'تقييم القرار' : 'Evaluate'}</span><span>✨</span>`;
  }
}

// Render dynamic decision response
function renderDecisionCard(data) {
  document.getElementById("decision-doc-title").innerText = data.document_name;
  
  // Map Verdict & Confidence according to currentLanguage
  let verdictDisplay = data.verdict;
  if (currentLanguage === "en") {
    if (data.verdict.includes("حق نظامي") || data.verdict.includes("Entitlement")) {
      verdictDisplay = "Approved (Legal Entitlement)";
    } else if (data.verdict.includes("معتمد بشروط") || data.verdict.includes("Conditions")) {
      verdictDisplay = "Approved w/ Conditions";
    } else if (data.verdict.includes("استثناء") || data.verdict.includes("Exception")) {
      verdictDisplay = "Requires CFO Exception";
    } else if (data.verdict.includes("موثق") || data.verdict.includes("Verified")) {
      verdictDisplay = "Verified Policy Finding";
    }
  } else {
    if (data.verdict.includes("Entitlement") || data.verdict.includes("حق نظامي")) {
      verdictDisplay = "حق نظامي معتمد";
    } else if (data.verdict.includes("Conditions") || data.verdict.includes("معتمد بشروط")) {
      verdictDisplay = "معتمد بشروط";
    } else if (data.verdict.includes("Exception") || data.verdict.includes("استثناء")) {
      verdictDisplay = "يتطلب استثناء مالي";
    } else if (data.verdict.includes("Verified") || data.verdict.includes("موثق")) {
      verdictDisplay = "تم التحقق (نص موثق)";
    }
  }

  // Verdict Badge
  const verdictBadge = document.getElementById("decision-verdict-badge");
  verdictBadge.innerText = verdictDisplay;
  const vLower = verdictDisplay.toLowerCase();
  if (vLower.includes("approved") || vLower.includes("معتمد") || vLower.includes("حق نظامي") || vLower.includes("موثق") || vLower.includes("verified")) {
    verdictBadge.className = "px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40";
  } else if (vLower.includes("rejected") || vLower.includes("conflict") || vLower.includes("مرفوض") || vLower.includes("تعارض")) {
    verdictBadge.className = "px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/40";
  } else {
    verdictBadge.className = "px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40";
  }

  // Grounding Confidence
  const confText = currentLanguage === 'ar' ? `${data.grounding_confidence}% موثق` : `${data.grounding_confidence}% Grounded`;
  document.getElementById("decision-confidence-badge").innerText = `⚡ ${confText}`;
  
  // Executive Summary
  document.getElementById("decision-summary-text").innerText = data.executive_summary;

  // Citation & jump to page
  if (data.citations && data.citations.length > 0) {
    const c = data.citations[0];
    const isAr = /[\u0600-\u06FF]/.test(c.exact_quote);
    const citeTitle = isAr ? `الاستشهاد الحرفي (الصفحة ${c.page_number}، ${c.section_title})` : `Source Verbatim (Page ${c.page_number}, ${c.section_title})`;
    
    document.getElementById("citation-header-title").innerText = citeTitle;
    document.getElementById("citation-quote-text").innerText = `"${c.exact_quote}"`;
    
    // Automatically load the cited page in the left viewer
    onWorkspaceDocChange(c.page_number);
  }

  // Risk Alert
  const riskCard = document.getElementById("decision-risk-card");
  if (data.risk_alert) {
    riskCard.classList.remove("hidden");
    document.getElementById("risk-title-text").innerText = data.risk_alert.title;
    document.getElementById("risk-desc-text").innerText = data.risk_alert.description;
  } else {
    riskCard.classList.add("hidden");
  }

  // Action Items Checklist
  const checklistContainer = document.getElementById("action-checklist-container");
  checklistContainer.innerHTML = "";
  if (data.action_items && data.action_items.length > 0) {
    data.action_items.forEach((act) => {
      const checkedAttr = act.completed ? "checked" : "";
      const textClass = act.completed ? "line-through text-gray-500" : "text-gray-300";
      checklistContainer.innerHTML += `
        <label class="flex items-center gap-2.5 hover:text-white cursor-pointer" onclick="toggleActionItem(this)">
          <input type="checkbox" ${checkedAttr} class="rounded bg-[#0b0f17] border-gray-600 text-amber-500 focus:ring-amber-500"/>
          <span class="${textClass}">${act.text}</span>
        </label>
      `;
    });
  }

  // Latency
  document.getElementById("latency-indicator").innerText = currentLanguage === "ar" 
    ? `سرعة الاسترجاع: ${data.retrieval_latency_ms}ms` 
    : `Latency: ${data.retrieval_latency_ms}ms`;

  highlightCitation();
}

function toggleActionItem(labelElem) {
  const checkbox = labelElem.querySelector("input");
  const span = labelElem.querySelector("span");
  if (checkbox.checked) {
    span.classList.add("line-through", "text-gray-500");
    span.classList.remove("text-gray-300");
  } else {
    span.classList.remove("line-through", "text-gray-500");
    span.classList.add("text-gray-300");
  }
}

function highlightCitation() {
  const box = document.getElementById("citation-highlight-box");
  if (box) {
    box.classList.add("ring-2", "ring-amber-400", "pulse-glow");
    box.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      box.classList.remove("ring-2", "ring-amber-400", "pulse-glow");
    }, 2500);
  }
}

// Ingestion Pipeline & File Upload
async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("category", "مستندات مضافة");

  document.getElementById("pipeline-active-file").innerText = `جاري الفهرسة والتضمين: ${file.name}...`;

  try {
    const res = await fetch("/api/documents/upload", {
      method: "POST",
      body: formData
    });
    const result = await res.json();
    if (result.success) {
      document.getElementById("pipeline-active-file").innerText = `${file.name} (تمت الفهرسة بنجاح ✓)`;
      loadDocumentsCatalog();
      
      // Add to workspace select dropdown and select it
      const select = document.getElementById("workspace-doc-select");
      const opt = document.createElement("option");
      opt.value = file.name;
      opt.innerText = `${file.name} (${result.document.total_pages} صفحات)`;
      select.appendChild(opt);
      select.value = file.name;
      
      // Immediately display first page
      onWorkspaceDocChange(1);
    }
  } catch (err) {
    console.error("Upload error:", err);
    document.getElementById("pipeline-active-file").innerText = `خطأ أثناء رفع الملف: ${file.name}`;
  }
}

// Load Document Catalog Table
async function loadDocumentsCatalog() {
  try {
    const res = await fetch("/api/documents");
    const data = await res.json();
    
    document.getElementById("stat-total-docs").innerText = data.total_documents;
    document.getElementById("stat-total-chunks").innerText = Number(data.total_chunks).toLocaleString();

    const tbody = document.getElementById("documents-table-body");
    tbody.innerHTML = "";

    data.documents.forEach(doc => {
      const isGreen = doc.grounding_health.includes("100%") || doc.grounding_health.includes("98%") || doc.grounding_health.includes("96%");
      const badgeColor = isGreen ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" : "text-amber-400 bg-amber-500/10 border-amber-500/30";
      
      tbody.innerHTML += `
        <tr class="hover:bg-white/[0.02] transition-all">
          <td class="py-3 px-4 font-bold text-white flex items-center gap-2">
            <span>📄</span>
            ${doc.filename}
          </td>
          <td class="py-3 px-4 text-gray-400">${doc.category}</td>
          <td class="py-3 px-4">${doc.total_pages}</td>
          <td class="py-3 px-4 text-amber-300 font-bold">${doc.chunk_count}</td>
          <td class="py-3 px-4 text-gray-400">${doc.embedding_model}</td>
          <td class="py-3 px-4">
            <span class="px-2 py-0.5 rounded text-[10px] border ${badgeColor}">
              ${doc.grounding_health}
            </span>
          </td>
          <td class="py-3 px-4 text-left">
            <button onclick="auditDocument('${doc.filename}')" class="text-amber-400 hover:underline">
              ${currentLanguage === 'ar' ? 'مراجعة' : 'Audit'}
            </button>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    console.error("Error loading catalog:", err);
  }
}

function auditDocument(docName) {
  const select = document.getElementById("workspace-doc-select");
  select.value = docName;
  onWorkspaceDocChange(1);
  switchTab("workspace");
}

// Discrepancy Engine Actions
async function runDiscrepancyAudit() {
  const btn = document.querySelector("#view-discrepancy button");
  if (btn) btn.innerHTML = `<span>⏳ ${currentLanguage === 'ar' ? 'جاري تحليل البنود والتعارضات...' : 'Analyzing Policy & Contract Conflicts...'}</span>`;

  try {
    const res = await fetch("/api/discrepancy/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        baseline_doc_id: "Global_Procurement_Policy_2026.pdf",
        target_doc_id: "Vendor_TechServices_SLA_Draft.pdf"
      })
    });
    const data = await res.json();
    console.log("Audit complete:", data);
  } catch (e) {
    console.error(e);
  } finally {
    if (btn) btn.innerHTML = `<span>⚡</span><span>${currentLanguage === 'ar' ? 'تشغيل التدقيق واكتشاف التناقضات' : 'Run Deep AI Discrepancy Audit'}</span>`;
  }
}

function generateAmendmentModal() {
  document.getElementById("amendment-modal").classList.remove("hidden");
}

function closeAmendmentModal() {
  document.getElementById("amendment-modal").classList.add("hidden");
}

function copyAmendmentText() {
  const text = document.getElementById("amendment-result-text").innerText;
  navigator.clipboard.writeText(text);
  alert(currentLanguage === "ar" ? "تم نسخ البند القانوني البديل إلى الحافظة!" : "Amended clause copied to clipboard!");
}

async function loadHealthStatus() {
  try {
    const res = await fetch("/api/health");
    if (!res.ok) return;
    const data = await res.json();
    const select = document.getElementById("provider-select");
    const dot = document.getElementById("provider-status-dot");
    if (select) {
      select.value = data.llm_provider || "gemini";
    }
    if (dot) {
      if (data.llm_provider === "ollama" || data.llm_provider === "local") {
        dot.className = "w-2 h-2 rounded-full bg-emerald-400 animate-pulse";
      } else {
        dot.className = "w-2 h-2 rounded-full bg-emerald-500";
      }
    }
  } catch (e) {
    console.error("Health check error:", e);
  }
}

async function onProviderSelectChange(provider) {
  try {
    const res = await fetch(`/api/settings/provider?provider=${encodeURIComponent(provider)}`, {
      method: "POST"
    });
    if (!res.ok) throw new Error("Failed to switch provider");
    const data = await res.json();
    const dot = document.getElementById("provider-status-dot");
    if (provider === "ollama") {
      if (dot) dot.className = "w-2 h-2 rounded-full bg-emerald-400 animate-pulse";
      alert(currentLanguage === "ar" 
        ? "🛡️ تم التحويل إلى وضع التشغيل المحلي On-Premises (بيانات مغلقة 100% بدون إنترنت)" 
        : "🛡️ Switched to On-Premises Local LLM Mode (Zero Data Leakage)");
    } else {
      if (dot) dot.className = "w-2 h-2 rounded-full bg-emerald-500";
      alert(currentLanguage === "ar" 
        ? "⚡ تم التحويل إلى وضع السحابة الفائقة Google Gemini 2.0 Flash" 
        : "⚡ Switched to Google Gemini 2.0 Flash Cloud Mode");
    }
  } catch (e) {
    console.error("Provider switch error:", e);
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  loadHealthStatus();
  loadDocumentsCatalog();
  onWorkspaceDocChange(1);
});
