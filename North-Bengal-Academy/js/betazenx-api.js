/**
 * ── BetaZenX ERP Website Integration Module ──────────────────────────
 * Handles dynamic API data loading for admissions, galleries, and teachers.
 * All public endpoints are secure-by-default and verified via CORS on the ERP backend.
 */

// ── BetaZenX ERP Client Configuration (Fallback)
if (typeof window.BETAZENX_CONFIG === "undefined") {
    window.BETAZENX_CONFIG = {
        apiKey: "betazenx_api_nba_2026_xZ9q",        // Public client integration key
        slug: "cobschool",                          // North Bengal Academy unique slug
        deployMode: true,                           // Set to true for live server, false for local development
        
        prodBaseUrl: "https://betazenx.online",      // Production ERP domain
        localBaseUrl: "http://localhost:3000",       // Local Next.js port
        
        prodApiUrl: "https://betazenx.online/api",   // Production API domain
        localApiUrl: "http://localhost:5000/api",    // Local backend API port
    };
}


// Hook to configure base URLs based on environment & deployMode
(function() {
    const isLocalEnv = window.location.hostname === "localhost" || 
                       window.location.hostname === "127.0.0.1" || 
                       window.location.protocol === "file:";
                       
    const isLocal = BETAZENX_CONFIG.deployMode !== undefined ? !BETAZENX_CONFIG.deployMode : isLocalEnv;
    
    BETAZENX_CONFIG.baseUrl = isLocal ? BETAZENX_CONFIG.localApiUrl : BETAZENX_CONFIG.prodApiUrl;
})();

// ── Fetch admission status (No API key required)
async function loadAdmissionStatus() {
    try {
        const res = await fetch(
            `${BETAZENX_CONFIG.baseUrl}/public/website/${BETAZENX_CONFIG.slug}/admission-status`
        );
        if (!res.ok) return;
        const data = await res.json();
        const navBadge = document.getElementById("admissionNavBadge");
        const mobBadge = document.getElementById("admissionMobBadge");
        if (data.admissionOpen) {
            if (navBadge) navBadge.style.display = "";
            if (mobBadge) mobBadge.style.display = "";
        }
    } catch (e) {
        console.log("[BetaZenX] Could not reach API (offline or not configured yet).");
    }
}

// ── Fetch school gallery from API
async function loadGalleryFromAPI() {
    if (!BETAZENX_CONFIG.apiKey) return;
    try {
        const res = await fetch(
            `${BETAZENX_CONFIG.baseUrl}/public/website/${BETAZENX_CONFIG.slug}/gallery`,
            { headers: { "X-API-Key": BETAZENX_CONFIG.apiKey } }
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!data.images || data.images.length === 0) return;

        const grid = document.getElementById("galleryPreviewGrid");
        if (!grid) return;

        // Replace static images with API images (show first 6)
        const preview = data.images.slice(0, 6);
        grid.innerHTML = preview.map(url => `
            <div class="g-item">
                <img src="${url}" alt="School Gallery" loading="lazy">
                <div class="g-overlay"><i class="fas fa-expand"></i></div>
            </div>
        `).join("");
    } catch (e) {
        console.log("[BetaZenX] Gallery API not reachable, using static fallback.");
    }
}

// ── Fetch featured teachers from API
async function loadTeachersFromAPI() {
    if (!BETAZENX_CONFIG.apiKey) return;
    try {
        const res = await fetch(
            `${BETAZENX_CONFIG.baseUrl}/public/website/${BETAZENX_CONFIG.slug}/teachers`,
            { headers: { "X-API-Key": BETAZENX_CONFIG.apiKey } }
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!data.teachers || data.teachers.length === 0) return;

        const grid = document.querySelector(".faculty-grid");
        if (!grid) return;

        grid.innerHTML = data.teachers.map((t, i) => `
            <div class="faculty-card" data-aos="fade-up" data-aos-delay="${100 + i * 100}">
                <div class="faculty-img">
                    <img src="${t.photoUrl || 'https://i.pravatar.cc/400?u=' + t.id}" alt="${t.name}">
                    <div class="faculty-overlay">
                        <div class="faculty-social">
                            <a href="#" aria-label="Email"><i class="fas fa-envelope"></i></a>
                        </div>
                    </div>
                </div>
                <div class="faculty-info">
                    <h3>${t.name}</h3>
                    <p class="designation">${t.designation || ''}</p>
                    <p class="bio">${t.bio || (t.qualification ? t.qualification + (t.experience ? ' · ' + t.experience + ' experience' : '') : '')}</p>
                </div>
            </div>
        `).join("");

        // Re-init AOS for newly added elements
        if (typeof AOS !== 'undefined') AOS.refresh();
    } catch (e) {
        console.log("[BetaZenX] Teachers API not reachable, using static fallback.");
    }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
    // Update apply and status links dynamically based on deployment environment
    const isLocal = BETAZENX_CONFIG.deployMode !== undefined ? !BETAZENX_CONFIG.deployMode : 
                   (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:");
                   
    const baseDomain = isLocal ? BETAZENX_CONFIG.localBaseUrl : BETAZENX_CONFIG.prodBaseUrl;
    
    const applyLink = document.getElementById("applyNowLink");
    if (applyLink) {
        applyLink.href = `${baseDomain}/@${BETAZENX_CONFIG.slug}/apply`;
    }
    const statusLink = document.getElementById("checkStatusLink");
    if (statusLink) {
        statusLink.href = `${baseDomain}/@${BETAZENX_CONFIG.slug}/status`;
    }

    loadAdmissionStatus();
    loadGalleryFromAPI();
    loadTeachersFromAPI();
});
