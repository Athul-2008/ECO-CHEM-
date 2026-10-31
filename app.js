const itemCatalog = {
  'banana peel': {
    stream: 'Biodegradable', key: 'bio', confidence: 97, icon: 'banana',
    why: 'A banana peel is mostly water and plant fibre. In a suitable composting system, microorganisms break that organic matter down into soil-building material.',
    tip: 'Place it in your food-scraps or organics caddy if your local program accepts food waste. Otherwise, use a home compost system where appropriate.',
    safety: 'Keep food waste separate from packaging. Compostable-looking wrappers are not necessarily accepted with organics.'
  },
  'plastic bottle': {
    stream: 'Recyclable', key: 'recycle', confidence: 94, icon: 'bottle',
    why: 'Many drink bottles are PET (polyethylene terephthalate); some cleaning bottles are HDPE. These polymers can be mechanically recycled when local facilities accept them.',
    tip: 'Empty, rinse and let it dry. Keep the cap on only if your local program asks you to; check the label and your community’s collection rules.',
    safety: 'Never place a bottle containing chemicals or unknown liquids in household recycling. Keep its original label when handling cleaners.'
  },
  'old battery': {
    stream: 'Hazardous', key: 'hazard', confidence: 99, icon: 'battery',
    why: 'Batteries contain reactive metals and electrolytes. Damaged cells can leak, overheat or ignite, so they require a dedicated recovery route.',
    tip: 'Take it to a battery drop-off or household hazardous-waste collection. For lithium batteries, cover exposed terminals with non-conductive tape if local guidance recommends it.',
    safety: 'Do not put batteries in household bins, crush or puncture them. Keep damaged or hot batteries away from combustible materials and seek local advice.'
  },
  smartphone: {
    stream: 'Electronic', key: 'electronic', confidence: 98, icon: 'phone',
    why: 'A phone combines circuit boards, glass, plastics and a lithium-ion battery. Separate recovery can reclaim valuable metals and keep hazardous components out of landfill.',
    tip: 'Back up and erase personal data, then use an e-waste drop-off, retailer take-back or manufacturer recycling program.',
    safety: 'Do not put a phone or its battery in a household recycling bin. If the battery is swollen, hot or damaged, do not charge or puncture it.'
  },
  'paper cup': {
    stream: 'Recyclable', key: 'recycle', confidence: 82, icon: 'cup',
    why: 'Paper cups often contain a thin plastic or bioplastic lining. That mixed-material layer can make them unsuitable for ordinary paper recycling.',
    tip: 'Check whether your local service has a dedicated cup collection. If it does not, place it in general waste rather than contaminating clean paper.',
    safety: 'Remove leftover liquid. A cup marked “compostable” needs a suitable local processing service; it may not belong in a home compost bin.'
  },
  'paint can': {
    stream: 'Hazardous', key: 'hazard', confidence: 96, icon: 'paint',
    why: 'Wet paint may contain pigments, binders and solvents that can contaminate water and soil. Empty, fully dried containers may be treated differently by local programs.',
    tip: 'Keep the can closed and take leftover paint to a household hazardous-waste collection. Check local rules for empty or fully dried cans.',
    safety: 'Do not pour paint into a drain or mix it with other products. Keep it away from children, heat and open flames.'
  }
};

const streamDetails = {
  bio: { color: '#5d8a51', pale: '#e9f1e4', label: 'Organic matter', icon: 'leaf' },
  recycle: { color: '#397ca7', pale: '#e9f2f7', label: 'Material recovery', icon: 'recycle' },
  hazard: { color: '#c1733d', pale: '#fbefe4', label: 'Special collection', icon: 'shield' },
  electronic: { color: '#b75650', pale: '#f7e9e8', label: 'E-waste recovery', icon: 'cpu' },
  unknown: { color: '#aa8547', pale: '#fbf2dd', label: 'Pause and identify', icon: 'warning' }
};

const searchForm = document.querySelector('#sort-form');
const searchInput = document.querySelector('#item-search');
const typeaheadList = document.querySelector('#typeahead-list');
const resultSection = document.querySelector('#results');
const resultCard = document.querySelector('#result-card');
const photoInput = document.querySelector('#photo-input');
const imagePreview = document.querySelector('#image-preview');
const imagePlaceholder = document.querySelector('#image-placeholder');
const fileStatus = document.querySelector('#file-status');
const analyzePhotoButton = document.querySelector('#analyze-photo');
const dropZone = document.querySelector('#drop-zone');
let selectedPhoto = null;
let photoObjectUrl = null;
const searchSuggestions = [...document.querySelectorAll('[data-suggest]')].map((button) => button.dataset.suggest);
let activeSuggestion = -1;

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function describeItem(rawItem) {
  const clean = String(rawItem || '').trim().replace(/\s+/g, ' ');
  const normalized = clean.toLowerCase();
  if (!clean) return null;
  if (itemCatalog[normalized]) return { ...itemCatalog[normalized], name: clean, known: true };
  if (/battery|paint|chemical|pesticide|solvent|medicine|cleaner|oil|aerosol|bleach|thermometer/.test(normalized)) {
    return {
      name: clean, stream: 'Hazardous', key: 'hazard', confidence: 61, icon: 'generic', known: false,
      why: 'This item may contain reactive, toxic or regulated materials. Its exact composition and local handling rules are not clear from the name alone.',
      tip: 'Keep it closed and separate. Look for a local household hazardous-waste or specialist take-back service before disposing of it.',
      safety: 'Do not open, mix, pour out or put an unidentified chemical product in household bins. Ask your local waste service if unsure.'
    };
  }
  if (/phone|laptop|computer|tablet|charger|cable|electronic|appliance|earbud|headphone|screen/.test(normalized)) {
    return {
      name: clean, stream: 'Electronic', key: 'electronic', confidence: 67, icon: 'generic', known: false,
      why: 'Electronic items can combine circuit boards, plastics, glass and batteries, which need a separate recovery route.',
      tip: 'Check for an e-waste drop-off or retailer take-back program. Remove personal data from devices before recycling.',
      safety: 'Do not put electronics or loose lithium batteries in a household recycling bin. Keep damaged batteries away from heat.'
    };
  }
  if (/peel|fruit|vegetable|food|coffee|tea bag|eggshell|leaves|garden|scraps/.test(normalized)) {
    return {
      name: clean, stream: 'Biodegradable', key: 'bio', confidence: 64, icon: 'generic', known: false,
      why: 'Food and untreated plant material can often break down through composting, but local programs differ on what they accept.',
      tip: 'Use a food-scraps or organics collection if your community has one. Keep wrappers and non-compostable packaging out.',
      safety: 'Do not assume packaging marked compostable is accepted with food scraps; check your local service.'
    };
  }
  if (/plastic|paper|cardboard|glass|aluminum|aluminium|tin can|steel can|carton|bottle|jar/.test(normalized)) {
    return {
      name: clean, stream: 'Recyclable', key: 'recycle', confidence: 59, icon: 'generic', known: false,
      why: 'This material may be recyclable where a matching local collection and processing facility exists; mixed layers and residue can change the answer.',
      tip: 'Empty and rinse it, then check your local collection list. If materials are bonded together, use the local instructions for mixed packaging.',
      safety: 'Keep liquids and food residue out of the recycling stream. Never recycle a container that held an unknown chemical.'
    };
  }
  return {
    name: clean, stream: 'Hold separate', key: 'unknown', confidence: null, icon: 'generic', known: false,
    why: 'The material is not clear from the item name. Guessing could contaminate a recycling stream or expose someone to an unknown substance.',
    tip: 'Check the label or ask your local waste service. Keep it separate from recycling and compost until you identify its material and local instructions.',
    safety: 'Do not open, crush or mix an unknown item. If it leaks, smells unusual or feels hot, keep your distance and seek local safety advice.'
  };
}

function renderItemArt(icon) {
  const drawings = {
    banana: '<path d="M74 47c3 42 18 91 83 132 19 12 44 20 67 19 16-1 27-8 28-18 1-9-7-14-18-13-20 3-33-2-53-14-33-20-57-63-67-107l-40 1Z" fill="#f4cf64" stroke="#c89f42" stroke-width="5" stroke-linejoin="round"/><path d="M72 48c4-9 13-14 25-14l21 6-6 19-33 2M229 177l17 3 9 13-17 5-13-8" fill="#5d6440"/><path d="M102 62c10 51 34 91 74 119" fill="none" stroke="#e5b947" stroke-width="5" stroke-linecap="round"/>',
    bottle: '<path d="M115 40h70v24l-8 13v14c22 12 31 28 31 52v74c0 13-10 23-23 23h-70c-13 0-23-10-23-23v-74c0-24 9-40 31-52V77l-8-13V40Z" fill="#d889aa" stroke="#b96083" stroke-width="5"/><path d="M128 40h43V25h-43z" fill="#f4e7e9" stroke="#b96083" stroke-width="4"/><path d="M110 119h80v53h-80z" rx="4" fill="#fff7f4"/><path d="M124 132h51M124 143h37M124 154h46" stroke="#d28da3" stroke-width="4" stroke-linecap="round"/><circle cx="150" cy="105" r="10" fill="#f5e9df"/>',
    battery: '<rect x="83" y="72" width="134" height="137" rx="18" fill="#d5ddd3" stroke="#7b897b" stroke-width="5"/><path d="M125 55h50v19h-50z" fill="#7b897b"/><rect x="111" y="102" width="78" height="72" rx="6" fill="#f7f8ef"/><path d="M151 111v23m-11-12h23" stroke="#7b897b" stroke-width="6" stroke-linecap="round"/><path d="M115 187h70" stroke="#9eaa9d" stroke-width="5" stroke-linecap="round"/>',
    phone: '<rect x="101" y="28" width="98" height="202" rx="18" fill="#2f3e38" stroke="#172a21" stroke-width="5"/><rect x="109" y="43" width="82" height="162" rx="8" fill="#dbe9d8"/><path d="M121 153c14-39 29-60 57-83v119h-57z" fill="#78a279"/><circle cx="150" cy="218" r="4" fill="#b6c4b8"/><rect x="137" y="34" width="26" height="3" rx="2" fill="#77867c"/>',
    cup: '<path d="M91 66h119l-16 150c-1 8-7 13-15 13h-57c-8 0-14-5-15-13L91 66Z" fill="#f3f2e8" stroke="#a8b5a8" stroke-width="5"/><path d="M85 61h131v15H85z" rx="5" fill="#d7e5eb" stroke="#93a6ae" stroke-width="4"/><path d="M108 105h85l-4 41h-77z" fill="#c7dcd8"/><path d="M125 116h48" stroke="#f6faf6" stroke-width="5" stroke-linecap="round"/>',
    paint: '<rect x="85" y="75" width="130" height="133" rx="10" fill="#e5a96f" stroke="#ba7040" stroke-width="5"/><path d="M77 77h146v20H77z" rx="6" fill="#86998a"/><path d="M112 57c0-25 76-25 76 0v19" fill="none" stroke="#7a8b7a" stroke-width="7" stroke-linecap="round"/><rect x="105" y="112" width="90" height="52" rx="4" fill="#fbf7e7"/><path d="M119 127h62m-62 12h43" stroke="#c77a48" stroke-width="4" stroke-linecap="round"/>'
  };
  const drawing = drawings[icon] || '<circle cx="150" cy="128" r="76" fill="#e8efe4" stroke="#88a283" stroke-width="4"/><path d="M150 83v90m-36-45h72" stroke="#5e885d" stroke-width="8" stroke-linecap="round"/><circle cx="150" cy="128" r="100" fill="none" stroke="#d1dfce" stroke-width="2" stroke-dasharray="7 9"/>';
  return `<svg viewBox="0 0 300 260" role="img" aria-label="Illustration of the item">${drawing}</svg>`;
}

function showResult(rawItem, options = {}) {
  const result = describeItem(rawItem);
  if (!result) {
    searchInput.focus();
    return;
  }
  const stream = streamDetails[result.key];
  const confidence = Number.isFinite(result.confidence) ? Math.min(99, Math.max(45, result.confidence)) : null;
  resultCard.innerHTML = `
    <div class="result-topline"><span>YOUR SORTING SNAPSHOT</span><span class="result-live"><i></i> ${result.known ? 'REFERENCE MATCH' : confidence === null ? 'NEEDS IDENTIFICATION' : 'CAUTIOUS STARTING POINT'}</span></div>
    <div class="result-main" style="--stream-color:${stream.color};--stream-bg:${stream.pale}">
      <div class="result-object">
        <div><span class="item-kicker">YOU'RE SORTING</span><h3 class="item-name">${escapeHTML(result.name)}</h3></div>
        <div class="item-art">${renderItemArt(result.icon)}</div>
        <div class="place-in"><span class="place-in-icon"><svg class="icon"><use href="#i-${stream.icon}"/></svg></span><span><small>${confidence === null ? 'UNTIL IDENTIFIED' : 'PLACE IN'}</small><strong>${escapeHTML(result.stream)}</strong></span></div>
      </div>
      <div class="result-details">
        <div class="confidence-row"><span class="confidence-title">GUIDANCE CONFIDENCE</span><span class="confidence-value">${confidence === null ? 'Check locally' : `${confidence}%`}</span></div>
        ${confidence === null ? '<p class="confidence-note">Not enough detail to make a reliable stream match.</p>' : `<div class="confidence-track" role="meter" aria-label="Guidance confidence" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${confidence}"><div class="confidence-fill" style="--confidence:${confidence}%"></div></div>`}
        <div class="result-explanation"><div><h3>Why this stream?</h3><p>${escapeHTML(result.why)}</p></div><div><h3>What to do next</h3><p>${escapeHTML(result.tip)}</p></div></div>
        <div class="safety-warning"><svg class="icon"><use href="#i-warning"/></svg><p><strong>Safety note</strong>${escapeHTML(result.safety)}</p></div>
      </div>
    </div>`;
  resultSection.hidden = false;
  if (options.scroll !== false) {
    window.setTimeout(() => resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' }), 40);
  }
}

function closeTypeahead() {
  typeaheadList.hidden = true;
  typeaheadList.innerHTML = '';
  activeSuggestion = -1;
  searchInput.setAttribute('aria-expanded', 'false');
  searchInput.removeAttribute('aria-activedescendant');
}

function updateTypeahead() {
  const query = searchInput.value.trim().toLowerCase();
  activeSuggestion = -1;
  if (query.length < 2 || searchSuggestions.some((item) => item.toLowerCase() === query)) {
    closeTypeahead();
    return;
  }
  const matches = searchSuggestions.filter((item) => item.toLowerCase().includes(query)).slice(0, 5);
  if (!matches.length) {
    closeTypeahead();
    return;
  }
  typeaheadList.innerHTML = matches.map((item, index) => `<button id="suggestion-option-${index}" class="typeahead-option" type="button" role="option" aria-selected="false" data-typeahead="${escapeHTML(item)}">${escapeHTML(item)}</button>`).join('');
  typeaheadList.hidden = false;
  searchInput.setAttribute('aria-expanded', 'true');
}

function chooseTypeahead(item) {
  searchInput.value = item;
  closeTypeahead();
  searchInput.focus();
}

searchInput.addEventListener('input', updateTypeahead);
searchInput.addEventListener('keydown', (event) => {
  const options = [...typeaheadList.querySelectorAll('[role="option"]')];
  if (event.key === 'Escape') {
    closeTypeahead();
    return;
  }
  if (!options.length) return;
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    const direction = event.key === 'ArrowDown' ? 1 : -1;
    activeSuggestion = (activeSuggestion + direction + options.length) % options.length;
    options.forEach((option, index) => {
      const selected = index === activeSuggestion;
      option.classList.toggle('is-active', selected);
      option.setAttribute('aria-selected', String(selected));
    });
    searchInput.setAttribute('aria-activedescendant', options[activeSuggestion].id);
  } else if (event.key === 'Enter' && activeSuggestion >= 0) {
    event.preventDefault();
    chooseTypeahead(options[activeSuggestion].dataset.typeahead);
  }
});
typeaheadList.addEventListener('mousedown', (event) => event.preventDefault());
typeaheadList.addEventListener('click', (event) => {
  const option = event.target.closest('[data-typeahead]');
  if (option) chooseTypeahead(option.dataset.typeahead);
});

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  closeTypeahead();
  showResult(searchInput.value);
});

document.querySelectorAll('[data-suggest]').forEach((button) => {
  button.addEventListener('click', () => {
    closeTypeahead();
    searchInput.value = button.dataset.suggest;
    showResult(button.dataset.suggest);
  });
});

document.querySelectorAll('.stream-card[data-item]').forEach((button) => {
  button.addEventListener('click', () => {
    searchInput.value = button.dataset.item;
    showResult(button.dataset.item);
  });
});

const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('#primary-nav');
menuToggle.addEventListener('click', () => {
  const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isExpanded));
  menuToggle.setAttribute('aria-label', isExpanded ? 'Open navigation' : 'Close navigation');
  primaryNav.classList.toggle('is-open', !isExpanded);
});
primaryNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  primaryNav.classList.remove('is-open');
}));

document.querySelector('#year').textContent = new Date().getFullYear();

function resetPhoto(message) {
  selectedPhoto = null;
  photoInput.value = '';
  if (photoObjectUrl) URL.revokeObjectURL(photoObjectUrl);
  photoObjectUrl = null;
  imagePreview.removeAttribute('src');
  imagePreview.hidden = true;
  imagePlaceholder.hidden = false;
  fileStatus.textContent = message;
  analyzePhotoButton.disabled = true;
  analyzePhotoButton.innerHTML = 'Upload a photo <svg class="icon"><use href="#i-arrow"/></svg>';
}

function showPhoto(file) {
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    resetPhoto('Choose an image file to continue.');
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    resetPhoto('That image is over 10 MB. Choose a smaller photo.');
    return;
  }
  selectedPhoto = file;
  if (photoObjectUrl) URL.revokeObjectURL(photoObjectUrl);
  photoObjectUrl = URL.createObjectURL(file);
  imagePreview.src = photoObjectUrl;
  imagePreview.hidden = false;
  imagePlaceholder.hidden = true;
  fileStatus.textContent = `${file.name} · ${(file.size / (1024 * 1024)).toFixed(1)} MB · stays on this device`;
  analyzePhotoButton.disabled = false;
  analyzePhotoButton.innerHTML = 'Analyze this photo <svg class="icon"><use href="#i-arrow"/></svg>';
}

photoInput.addEventListener('change', () => showPhoto(photoInput.files?.[0]));
['dragenter', 'dragover'].forEach((eventName) => dropZone.addEventListener(eventName, (event) => {
  event.preventDefault();
  dropZone.classList.add('is-dragging');
}));
['dragleave', 'drop'].forEach((eventName) => dropZone.addEventListener(eventName, (event) => {
  event.preventDefault();
  dropZone.classList.remove('is-dragging');
}));
dropZone.addEventListener('drop', (event) => showPhoto(event.dataTransfer?.files?.[0]));

analyzePhotoButton.addEventListener('click', () => {
  if (!selectedPhoto) return;
  const filename = selectedPhoto.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ');
  const hint = filename || 'unidentified item';
  searchInput.value = hint;
  showResult(hint, { scroll: true });
});
