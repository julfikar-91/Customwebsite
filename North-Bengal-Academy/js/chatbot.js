/* ==========================================================================
   BetaZenX premium AI Chatbot — Reusable Multi-Language & Voice Client
   ========================================================================== */

(function () {
  // ─── 1. RESOLVE CONFIGURATION & FALLBACKS ──────────────────────────────────
  let slug = "cobschool";
  let deployMode = true; // Set to true for live server, false for local development
  
  let prodApiUrl = "https://betazenx.online/api";
  let localApiUrl = "http://localhost:5000/api";
  
  let baseUrl = deployMode ? prodApiUrl : localApiUrl;
  let geminiApiKey = "";
  let apiKey = "";

  // Auto-detect local development/testing vs remote production environments
  const isLocalEnv = window.location.hostname === "localhost" || 
                     window.location.hostname === "127.0.0.1" || 
                     window.location.protocol === "file:";

  if (isLocalEnv && deployMode === undefined) {
    baseUrl = localApiUrl;
  }

  // Hook into unified BETAZENX_CONFIG if available (Production level configuration)
  try {
    if (typeof BETAZENX_CONFIG !== "undefined") {
      if (BETAZENX_CONFIG.slug) slug = BETAZENX_CONFIG.slug;
      if (BETAZENX_CONFIG.apiKey) apiKey = BETAZENX_CONFIG.apiKey;
      if (BETAZENX_CONFIG.geminiApiKey) geminiApiKey = BETAZENX_CONFIG.geminiApiKey;
      if (BETAZENX_CONFIG.baseUrl) {
        baseUrl = BETAZENX_CONFIG.baseUrl;
      } else if (BETAZENX_CONFIG.prodApiUrl && !isLocalEnv) {
        baseUrl = BETAZENX_CONFIG.prodApiUrl;
      } else if (BETAZENX_CONFIG.localApiUrl && isLocalEnv) {
        baseUrl = BETAZENX_CONFIG.localApiUrl;
      }
    }
  } catch (e) {}

  const schoolName = "North Bengal Academy"; // Fallback name
  let chatHistory = [];
  let isVoiceEnabled = false;

  // ─── 2. MULTI-LANGUAGE CONFIGURATIONS ──────────────────────────────────────
  const langConfig = {
    en: {
      welcome: `<p>Welcome to <strong>${schoolName}</strong>! 👋</p>
                <p>I am your school's Virtual AI Assistant. I can help you with:
                <ul>
                  <li>Admissions & How to Apply</li>
                  <li>Monthly Fees & Structure</li>
                  <li>Classes, Timing & Programs</li>
                  <li>Contact & Office Details</li>
                  <li>Meet our Teachers & Staff</li>
                </ul>
                What would you like to know today?</p>`,
      chips: [
        { label: "📝 Admission?", query: "Are admissions open? How to apply?" },
        { label: "💰 Fee Structure", query: "What is the monthly fee structure for different classes?" },
        { label: "🏫 Classes Offered", query: "What classes are offered and what are the age groups?" },
        { label: "📞 Contact Info", query: "What are the contact details, phone, and school address?" },
        { label: "👩‍🏫 School Faculty", query: "Tell me about the school principal and teachers." }
      ],
      inputPlaceholder: "Type your question here...",
      systemDirective: "Respond strictly in English.",
      audioGreeting: "Welcome to North Bengal Academy! I am your virtual school assistant. How can I help you today?"
    },
    bn: {
      welcome: `<p><strong>নর্থ বেঙ্গল একাডেমী</strong>-তে আপনাকে স্বাগতম! 👋</p>
                <p>আমি আপনার বিদ্যালয়ের ভার্চুয়াল এআই সহকারী। আমি আপনাকে সাহায্য করতে পারি:
                <ul>
                  <li>ভর্তি প্রক্রিয়া ও আবেদনপত্র</li>
                  <li>মাসিক ফি ও বেতন কাঠামো</li>
                  <li>শ্রেণীসমূহ, সময়সূচী ও প্রোগ্রাম</li>
                  <li>যোগাযোগ ও অফিসের বিবরণ</li>
                  <li>আমাদের শিক্ষক ও শিক্ষিকা পরিচিতি</li>
                </ul>
                আজ আপনি কী জানতে চান?</p>`,
      chips: [
        { label: "📝 ভর্তি তথ্য?", query: "ভর্তি কি খোলা আছে? কিভাবে আবেদন করব?" },
        { label: "💰 ফি স্ট্রাকচার", query: "বিভিন্ন ক্লাসের জন্য মাসিক ফি বা বেতনের বিবরণ কি?" },
        { label: "🏫 ক্লাসসমূহ", query: "কোন কোন ক্লাস অফার করা হয় এবং বয়স সীমা কি?" },
        { label: "📞 যোগাযোগ", query: "স্কুলের যোগাযোগের নম্বর এবং ঠিকানা কি?" },
        { label: "👩‍🏫 শিক্ষক পরিচিতি", query: "স্কুলের প্রিন্সিপাল এবং শিক্ষকদের সম্পর্কে বলুন।" }
      ],
      inputPlaceholder: "আপনার প্রশ্নটি এখানে লিখুন...",
      systemDirective: "Respond strictly in Bengali (বাংলা).",
      audioGreeting: "নর্থ বেঙ্গল একাডেমীতে আপনাকে স্বাগতম! আমি আপনার ভার্চুয়াল এআই সহকারী। আজ আপনাকে কীভাবে সাহায্য করতে পারি?"
    },
    hi: {
      welcome: `<p><strong>नॉर्थ बंगाल एकेडमी</strong> में आपका स्वागत है! 👋</p>
                <p>मैं आपकी स्कूल वर्चुअल एआई सहायक हूँ। मैं आपकी मदद कर सकती हूँ:
                <ul>
                  <li>प्रवेश प्रक्रिया और आवेदन कैसे करें</li>
                  <li>मासिक फीस और शुल्क संरचना</li>
                  <li>कक्षाएं, समय और पाठ्यक्रम</li>
                  <li>संपर्क और कार्यालय विवरण</li>
                  <li>हमारे शिक्षक और स्टाफ</li>
                </ul>
                आज आप क्या जानना चाहते हैं?</p>`,
      chips: [
        { label: "📝 प्रवेश प्रक्रिया?", query: "क्या प्रवेश खुले हैं? आवेदन कैसे करें?" },
        { label: "💰 फीस संरचना", query: "विभिन्न कक्षाओं के लिए मासिक फीस संरचना क्या है?" },
        { label: "🏫 कक्षाएं", query: "कौन सी कक्षाएं उपलब्ध हैं और आयु वर्ग क्या है?" },
        { label: "📞 संपर्क सूत्र", query: "संपर्क विवरण, फोन नंबर और स्कूल का पता क्या है?" },
        { label: "👩‍🏫 शिक्षक", query: "स्कूल के प्रधानाचार्य और शिक्षकों के बारे में बताएं।" }
      ],
      inputPlaceholder: "अपना प्रश्न यहाँ लिखें...",
      systemDirective: "Respond strictly in Hindi (हिंदी).",
      audioGreeting: "नॉर्थ बंगाल एकेडमी में आपका स्वागत है! मैं आपकी वर्चुअल एआई सहायक हूँ। आज मैं आपकी क्या मदद कर सकती हूँ?"
    }
  };

  // ─── 3. INJECT CHATBOT HTML DYNAMICALLY ────────────────────────────────────
  function injectChatbotHTML() {
    if (document.getElementById("cb-chatbot-root")) return;

    const root = document.createElement("div");
    root.id = "cb-chatbot-root";
    root.innerHTML = `
      <!-- Floating Trigger -->
      <div class="chatbot-trigger" id="cbTrigger">
        <i class="fas fa-comment-dots"></i>
        <span class="chatbot-notification-dot" id="cbNotification"></span>
      </div>

      <!-- Chat Panel -->
      <div class="chatbot-panel" id="cbPanel">
        <!-- Header -->
        <div class="chatbot-header">
          <div class="chatbot-header-info">
            <div class="chatbot-avatar">
              <i class="fas fa-graduation-cap"></i>
            </div>
            <div class="chatbot-title-area">
              <h3 id="cbSchoolName">${schoolName}</h3>
              <div class="chatbot-status">
                <span class="chatbot-status-dot"></span>
                <span>Active AI Support</span>
              </div>
            </div>
          </div>
          <button class="chatbot-close-btn" id="cbCloseBtn" aria-label="Close Chat">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Controls Toolbar Bar -->
        <div class="chatbot-controls-bar">
          <div class="cb-controls-left">
            <span class="cb-controls-label">Language:</span>
            <select class="cb-lang-select" id="cbLangSelect" title="Select Language">
              <option value="en">🇬🇧 English</option>
              <option value="bn">🇧🇩 বাংলা</option>
              <option value="hi">🇮🇳 हिंदी</option>
            </select>
          </div>
          <div class="cb-controls-right">
            <!-- Voice Button -->
            <button class="cb-header-action-btn voice-btn" id="cbVoiceBtn" title="Toggle Voice Speech">
              <i class="fas fa-volume-mute"></i>
            </button>
            <!-- Call Icon -->
            <a href="tel:+919563663702" class="cb-header-action-btn call" id="cbCallLink" title="Call School">
              <i class="fas fa-phone-alt"></i>
            </a>
            <!-- WhatsApp Icon -->
            <a href="https://wa.me/919563663702" class="cb-header-action-btn whatsapp" id="cbWhatsappLink" title="WhatsApp Chat" target="_blank">
              <i class="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>

        <!-- Messages Area -->
        <div class="chatbot-messages" id="cbMessages">
          <div class="cb-msg bot">
            <div class="cb-bubble">
              ${langConfig.en.welcome}
            </div>
            <span class="cb-timestamp">Just now</span>
          </div>
        </div>

        <!-- Quick Replies Area -->
        <div class="chatbot-quick-replies" id="cbQuickReplies">
          ${langConfig.en.chips.map(chip => `
            <span class="cb-chip" data-query="${chip.query}">${chip.label}</span>
          `).join("")}
        </div>

        <!-- Input Bar -->
        <form class="chatbot-input-bar" id="cbForm">
          <input type="text" id="cbInput" placeholder="Type your question here..." autocomplete="off" required />
          <button type="submit" class="chatbot-send-btn" id="cbSendBtn" aria-label="Send Message">
            <i class="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(root);
    fetchSchoolProfile();
  }

  let schoolFullData = null;

  // Fetch verified school details dynamically from public website API
  async function fetchSchoolProfile() {
    try {
      const headers = {};
      if (apiKey) headers["X-API-Key"] = apiKey;
      
      const res = await fetch(`${baseUrl}/public/website/${slug}/full`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data) {
          schoolFullData = data;
          const school = data.school || {};
          const config = data.config || {};
          
          if (school.name) {
            const headerName = document.getElementById("cbSchoolName");
            if (headerName) headerName.textContent = school.name;
          }
          if (config.contactPhone) {
            const callLink = document.getElementById("cbCallLink");
            if (callLink) callLink.href = `tel:${config.contactPhone}`;
          }
          if (config.whatsappNumber) {
            const waLink = document.getElementById("cbWhatsappLink");
            const cleanNumber = config.whatsappNumber.replace(/[^0-9]/g, "");
            if (waLink) waLink.href = `https://wa.me/${cleanNumber}`;
          }
        }
      }
    } catch (e) {
      console.log("[Chatbot] Offline or fetching basic school profile fallback active.");
    }
  }

  // ─── 4. VOICE SPEECH TEXT-TO-SPEECH (TTS) ──────────────────────────────────
  function toggleVoice() {
    isVoiceEnabled = !isVoiceEnabled;
    const voiceBtn = document.getElementById("cbVoiceBtn");
    if (voiceBtn) {
      if (isVoiceEnabled) {
        voiceBtn.classList.add("active");
        voiceBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        speakCurrentGreeting();
      } else {
        voiceBtn.classList.remove("active");
        voiceBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        if (window.speechSynthesis) window.speechSynthesis.cancel();
      }
    }
  }

  function speakCurrentGreeting() {
    const langSelect = document.getElementById("cbLangSelect");
    const currentLang = langSelect ? langSelect.value : "en";
    const greetingText = langConfig[currentLang]?.audioGreeting || langConfig.en.audioGreeting;
    speakText(greetingText);
  }

  function speakText(text) {
    if (!isVoiceEnabled || !window.speechSynthesis) return;
    
    // Stop any active speech synthesis
    window.speechSynthesis.cancel();

    // Clean text: strip HTML and markdown bold
    const cleanText = text.replace(/<[^>]*>/g, "")
                          .replace(/\*\*([^*]+)\*\*/g, "$1")
                          .replace(/^\s*-\s+/gm, "");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const langSelect = document.getElementById("cbLangSelect");
    const currentLang = langSelect ? langSelect.value : "en";

    // Set voice locale
    if (currentLang === "bn") {
      utterance.lang = "bn-IN";
    } else if (currentLang === "hi") {
      utterance.lang = "hi-IN";
    } else {
      utterance.lang = "en-US";
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }

  // ─── 5. MULTI-LANGUAGE APPLICATION ─────────────────────────────────────────
  function applyLanguage(lang) {
    const config = langConfig[lang] || langConfig.en;
    
    // Welcome bubble swap
    const messagesContainer = document.getElementById("cbMessages");
    if (messagesContainer) {
      messagesContainer.innerHTML = `
        <div class="cb-msg bot">
          <div class="cb-bubble">
            ${config.welcome}
          </div>
          <span class="cb-timestamp">Just now</span>
        </div>
      `;
    }

    // Chips swap
    const quickRepliesContainer = document.getElementById("cbQuickReplies");
    if (quickRepliesContainer) {
      quickRepliesContainer.innerHTML = config.chips.map(chip => `
        <span class="cb-chip" data-query="${chip.query}">${chip.label}</span>
      `).join("");
      
      // Bind click listeners to new chips
      const newChips = quickRepliesContainer.querySelectorAll(".cb-chip");
      newChips.forEach(chip => {
        chip.addEventListener("click", () => {
          const queryText = chip.getAttribute("data-query");
          if (queryText) sendMessageToAPI(queryText);
        });
      });
    }

    // Input placeholder swap
    const input = document.getElementById("cbInput");
    if (input) {
      input.placeholder = config.inputPlaceholder;
    }

    // Reset dialogue history for context correction in the new language
    chatHistory = [];

    // Trigger greeting audio
    if (isVoiceEnabled) {
      speakCurrentGreeting();
    }
  }

  // ─── 6. CORE CHAT TRANSACTION FLOW ─────────────────────────────────────────
  function parseMarkdown(text) {
    let html = text;

    // Convert markdown links [text](url) to premium styled buttons
    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (match, linkText, url) => {
      const isApply = url.toLowerCase().includes('apply') || 
                      url.toLowerCase().includes('admission') || 
                      linkText.toLowerCase().includes('apply') || 
                      linkText.includes('ভর্তি') || 
                      linkText.includes('আবেদন') ||
                      linkText.toLowerCase().includes('admission') ||
                      linkText.includes('प्रवेश') || 
                      linkText.includes('आवेदन');
      
      if (isApply) {
        return `<a href="${url}" target="_blank" class="cb-link-btn cta"><i class="fas fa-edit"></i> ${linkText}</a>`;
      } else {
        return `<a href="${url}" target="_blank" class="cb-link-btn"><i class="fas fa-external-link-alt"></i> ${linkText}</a>`;
      }
    });

    // Match raw URLs (http/https) that are not already part of an <a href="..."> tag
    const rawUrlRegex = /(?<!href=["'])(https?:\/\/[^\s<]+)/g;
    html = html.replace(rawUrlRegex, (match, url) => {
      // Strip trailing punctuation like periods or parentheses
      let cleanUrl = url;
      let trailing = "";
      const trailingMatch = url.match(/[.,;:)]+$/);
      if (trailingMatch) {
        cleanUrl = url.substring(0, url.length - trailingMatch[0].length);
        trailing = trailingMatch[0];
      }

      const isApply = cleanUrl.toLowerCase().includes('/apply') || 
                      cleanUrl.toLowerCase().includes('/admission') ||
                      cleanUrl.toLowerCase().includes('apply') ||
                      cleanUrl.toLowerCase().includes('admission');
                      
      if (isApply) {
        return `<a href="${cleanUrl}" target="_blank" class="cb-link-btn cta"><i class="fas fa-edit"></i> Apply Online / অনলাইনে আবেদন</a>${trailing}`;
      } else {
        // Truncate raw URL if it is too long to display cleanly
        const displayUrl = cleanUrl.length > 35 ? cleanUrl.substring(0, 32) + "..." : cleanUrl;
        return `<a href="${cleanUrl}" target="_blank" class="cb-link-btn"><i class="fas fa-external-link-alt"></i> ${displayUrl}</a>${trailing}`;
      }
    });

    // Standard markdown elements
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/^\s*-\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.+<\/li>)+/g, '<ul>$&</ul>');
    html = html.replace(/\n/g, '<br>');
    return html;
  }

  function appendMessage(sender, text) {
    const messagesContainer = document.getElementById("cbMessages");
    if (!messagesContainer) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgElement = document.createElement("div");
    msgElement.className = `cb-msg ${sender}`;
    msgElement.innerHTML = `
      <div class="cb-bubble">
        ${sender === 'bot' ? parseMarkdown(text) : `<p>${escapeHTML(text)}</p>`}
      </div>
      <span class="cb-timestamp">${timeString}</span>
    `;

    messagesContainer.appendChild(msgElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  function showTypingIndicator() {
    const messagesContainer = document.getElementById("cbMessages");
    if (!messagesContainer) return;

    const indicator = document.createElement("div");
    indicator.className = "cb-msg bot cb-typing-wrapper";
    indicator.id = "cbTypingIndicator";
    indicator.innerHTML = `
      <div class="cb-typing-indicator">
        <span class="cb-typing-dot"></span>
        <span class="cb-typing-dot"></span>
        <span class="cb-typing-dot"></span>
      </div>
    `;
    messagesContainer.appendChild(indicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById("cbTypingIndicator");
    if (indicator) indicator.remove();
  }

  async function sendMessageToAPI(messageText) {
    appendMessage("user", messageText);
    showTypingIndicator();

    const langSelect = document.getElementById("cbLangSelect");
    const currentLang = langSelect ? langSelect.value : "en";

    // Direct Gemini to Converse in the selected language
    let processedMessage = messageText;
    if (currentLang !== "en") {
      const directive = langConfig[currentLang]?.systemDirective || "";
      processedMessage = `[System instructions: ${directive}] ${messageText}`;
    }

    // 1. Build dynamic system instruction based on fetched school data
    const config = schoolFullData?.config || {};
    const school = schoolFullData?.school || { name: schoolName };
    const teachers = schoolFullData?.teachers?.teachers || [];
    const classes = schoolFullData?.classes || [];
    const notices = schoolFullData?.notices || [];
    
    const classesList = classes.length > 0
      ? classes.map(c => `- ${c.className}: Monthly Fee of ₹${Number(c.monthlyFee || 0)}`).join("\n")
      : "Not configured yet.";

    const teachersList = teachers.length > 0
      ? teachers.map(t => `- ${t.name}: ${t.designation || 'Educator'} (${t.qualification || 'N/A'}). ${t.bio || ''}`).join("\n")
      : "None configured yet.";

    const noticesList = notices.length > 0
      ? notices.map(n => `- [${new Date(n.date).toLocaleDateString()}] ${n.title}: ${n.content} (Category: ${n.category})`).join("\n")
      : "No recent announcements.";

    const systemInstruction = `You are a warm, helpful, and highly intelligent AI Admissions & Support Assistant for ${school.name || "North Bengal Academy"}.
Your goal is to answer queries from parents, students, and prospective families with 100% accurate, specific information based ONLY on the school's verified details below.

=== SCHOOL GENERAL PROFILE ===
- School Name: ${school.name || "North Bengal Academy"}
- Tagline: ${config.tagline || "Nurturing Future Thinkers"}
- Local Name: ${config.localName || ""}
- Address: ${config.address || "Not specified"}
- Phone: ${config.contactPhone || "Not specified"}
- Email: ${config.contactEmail || "Not specified"}
- Whatsapp Number: ${config.whatsappNumber || "Not specified"}
- Legacy/Founding Year: ${config.legacyYear || "Not specified"}
- Welcome Message: ${config.welcomeMessage || ""}
- About Us: ${config.aboutUs || ""}
- Social Media:
  - Facebook: ${config.facebook || "N/A"}
  - Instagram: ${config.instagram || "N/A"}
  - YouTube: ${config.youtube || "N/A"}
- Admissions Status: ${schoolFullData?.admissionOpen ? "OPEN (Active)" : "CLOSED"}
- School Website Online Portal: https://betazenx.online/@${slug} (Students and parents can apply online at /apply and check status at /status)

=== ACADEMIC PROGRAMS & FEES STRUCTURE ===
${classesList}

=== FACULTY & STAFF ===
${teachersList}

=== RECENT ANNOUNCEMENTS & NOTICES ===
${noticesList}

=== INSTRUCTIONS FOR YOUR CONVERSATION ===
1. Be polite, professional, and friendly. Answer in a structured and easily readable format.
2. ALWAYS prioritize the details provided in this prompt. Do NOT make up any fees, dates, or contact details.
3. If asked about admissions, emphasize that admissions are currently ${schoolFullData?.admissionOpen ? "OPEN. Families can apply online at the portal: https://betazenx.online/@" + slug + "/apply" : "CLOSED. Please contact the school office or email them for the next session's schedule"}.
4. If a user asks about the "last date" (শেষ তারিখ / ses tarikh / last date) of admission, explain that there is no fixed deadline configured yet, but seats are limited and filling up fast, so they are encouraged to apply online as soon as possible.
5. Understand and resolve queries typed in "Banglish" (Bengali words typed in English characters, e.g. "ses tarikh koto" -> "What is the last date?", "fees koto" -> "What are the fees?", "ভর্তি" -> admissions). Address them natively in the language chosen or in the language they used.
6. If a piece of information is not present in the school profile above, politely explain that you don't have that specific detail in your database and guide them to contact the school office directly at ${config.contactPhone || "their phone"} or email ${config.contactEmail || "their email"}. Do not make up facts.
7. You can converse in English, Bengali, Hindi, or any language the user uses. Support fully and naturally.
`;

    // 2. Build Gemini contents chat history format
    const contents = chatHistory.map(h => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.content }]
    }));
    
    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: processedMessage }]
    });

    try {
      if (!geminiApiKey) {
        throw new Error("Gemini API Key is not configured in client-side configuration.");
      }

      // Call Google Gemini API directly from browser!
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: contents,
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          }
        })
      });

      removeTypingIndicator();

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || "Direct Gemini API call failed.");
      }

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I encountered an issue processing your query.";

      appendMessage("bot", reply);
      
      // PERSIST dialogue state
      chatHistory.push({ role: "user", content: messageText });
      chatHistory.push({ role: "ai", content: reply });

      if (chatHistory.length > 20) {
        chatHistory = chatHistory.slice(chatHistory.length - 20);
      }

      // Voice readout bot response if voice active
      speakText(reply);

    } catch (error) {
      console.error("[Chatbot Error]", error);
      removeTypingIndicator();
      appendMessage("bot", currentLang === "bn" 
        ? "আমি চ্যাটবট সার্ভারের সাথে সংযুক্ত হতে পারছি না। অনুগ্রহ করে পৃষ্ঠাটি রিফ্রেশ করুন!" 
        : currentLang === "hi" 
          ? "मैं चैटबॉट सर्वर से कनेक्ट नहीं हो पा रही हूँ। कृपया पेज को रीफ्रेश करें!" 
          : "I am currently having trouble connecting to the school servers. Please call us directly or refresh to try again!"
      );
    }
  }

  // ─── 7. EVENT BINDINGS ─────────────────────────────────────────────────────
  function bindChatbotEvents() {
    const trigger = document.getElementById("cbTrigger");
    const panel = document.getElementById("cbPanel");
    const closeBtn = document.getElementById("cbCloseBtn");
    const form = document.getElementById("cbForm");
    const input = document.getElementById("cbInput");
    const notification = document.getElementById("cbNotification");
    const chips = document.querySelectorAll(".cb-chip");
    const langSelect = document.getElementById("cbLangSelect");
    const voiceBtn = document.getElementById("cbVoiceBtn");

    trigger.addEventListener("click", () => {
      panel.classList.add("open");
      trigger.style.opacity = "0";
      trigger.style.pointerEvents = "none";
      trigger.style.transform = "scale(0)";
      if (notification) notification.style.display = "none";
      setTimeout(() => input.focus(), 300);
    });

    closeBtn.addEventListener("click", () => {
      panel.classList.remove("open");
      trigger.style.opacity = "1";
      trigger.style.pointerEvents = "auto";
      trigger.style.transform = "scale(1)";
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      
      input.value = "";
      sendMessageToAPI(text);
    });

    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        const queryText = chip.getAttribute("data-query");
        if (queryText) sendMessageToAPI(queryText);
      });
    });

    langSelect.addEventListener("change", () => {
      applyLanguage(langSelect.value);
    });

    voiceBtn.addEventListener("click", (e) => {
      e.preventDefault();
      toggleVoice();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && panel.classList.contains("open")) {
        panel.classList.remove("open");
        trigger.style.opacity = "1";
        trigger.style.pointerEvents = "auto";
        trigger.style.transform = "scale(1)";
        if (window.speechSynthesis) window.speechSynthesis.cancel();
      }
    });
  }

  // ─── 8. INITIALIZE ON DOM ──────────────────────────────────────────────────
  if (document.readyState === "complete" || document.readyState === "interactive") {
    injectChatbotHTML();
    bindChatbotEvents();
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      injectChatbotHTML();
      bindChatbotEvents();
    });
  }
})();
