/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary:          'var(--color-primary)',
          'primary-vivid':  'var(--color-primary-vivid)',
          'primary-light':  'var(--color-primary-light)',
          'primary-dark':   'var(--color-primary-dark)',
          secondary:        'var(--color-secondary)',
          'secondary-light':'var(--color-secondary-light)',
          'secondary-dark': 'var(--color-secondary-dark)',
          accent:           'var(--color-accent)',
        },
        'subnav-bg':  'var(--color-subnav-bg)',
        'tab-accent': 'var(--color-tab-accent)',
        'tab-bg':     'var(--color-tab-bg)',
        card: {
          'header-text': 'var(--color-card-header-text)',
          'body-bg':     'var(--color-card-body-bg)',
          'body-text':   'var(--color-card-body-text)',
        },
        neutral: {
          50:  'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          900: 'var(--color-neutral-900)',
        },
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error:   'var(--color-error)',
        'success-dark': 'var(--color-success-dark)',
        'warning-dark': 'var(--color-warning-dark)',
        'error-dark':   'var(--color-error-dark)',
        'map-bg':       'var(--color-map-bg)',
        modal: {
          'header-bg':  'var(--color-modal-header-bg)',
          'studies-bg': 'var(--color-modal-studies-bg)',
        },
        quadrant: {
          'top-priority-bg': 'var(--color-quadrant-top-priority-bg)',
          'long-term-bg':    'var(--color-quadrant-long-term-bg)',
          'urgent-bg':       'var(--color-quadrant-urgent-bg)',
          'lower-bg':        'var(--color-quadrant-lower-bg)',
        },
        'gap-priority': {
          'high-bg':   'var(--color-gap-priority-high-bg)',
          'medium-bg': 'var(--color-gap-priority-medium-bg)',
          'low-bg':    'var(--color-gap-priority-low-bg)',
          'low-text':  'var(--color-gap-priority-low-text)',
        },
        'gap-urgency': {
          bg:   'var(--color-gap-urgency-bg)',
          text: 'var(--color-gap-urgency-text)',
        },
        icon: {
          etiology:  'var(--color-icon-etiology)',
          diagnosis: 'var(--color-icon-diagnosis)',
          cyan:      'var(--color-icon-cyan)',
          teal:      'var(--color-icon-teal)',
          orange:    'var(--color-icon-orange)',
        },
        si: {
          'header-1': 'var(--color-si-header-1-bg)',
          'header-2': 'var(--color-si-header-2-bg)',
          'header-3': 'var(--color-si-header-3-bg)',
          '1-label':  'var(--color-si-1-label)',
          '1-title':  'var(--color-si-1-title)',
          '2-label':  'var(--color-si-2-label)',
          '2-title':  'var(--color-si-2-title)',
          '3-label':  'var(--color-si-3-label)',
          '3-title':  'var(--color-si-3-title)',
        },
        mo: {
          'badge-text': 'var(--color-mo-badge-text)',
          'badge-bg':   'var(--color-mo-badge-bg)',
        },
        chart: {
          grid:         'var(--color-chart-grid)',
          'tick-muted': 'var(--color-chart-tick-muted)',
          'tick-mid':   'var(--color-chart-tick-mid)',
          label:        'var(--color-chart-label)',
        },
        vision:       'var(--color-vision)',
        badge: {
          'experts-text':  'var(--color-badge-experts-text)',
          'experts-bg':    'var(--color-badge-experts-bg)',
          'experts-dot':   'var(--color-badge-experts-dot)',
          'planning-text': 'var(--color-badge-planning-text)',
          'planning-bg':   'var(--color-badge-planning-bg)',
          'planning-dot':  'var(--color-badge-planning-dot)',
          'market-text':   'var(--color-badge-market-text)',
          'market-bg':     'var(--color-badge-market-bg)',
          'market-dot':    'var(--color-badge-market-dot)',
          'congress-text': 'var(--color-badge-congress-text)',
          'congress-bg':   'var(--color-badge-congress-bg)',
          'congress-dot':  'var(--color-badge-congress-dot)',
        },
        table: {
          'header-bg':       'var(--color-table-header-bg)',
          'sticky-row-even': 'var(--color-table-sticky-row-even)',
          'sticky-row-odd':  'var(--color-table-sticky-row-odd)',
          'sticky-text':     'var(--color-table-sticky-text)',
          'row-even':        'var(--color-table-row-even)',
          'row-odd':         'var(--color-table-row-odd)',
          'body-text':       'var(--color-table-body-text)',
        },
        'btn-secondary': {
          bg:           'var(--btn-secondary-bg)',
          text:         'var(--btn-secondary-text)',
          border:       'var(--btn-secondary-border)',
          'bg-hover':   'var(--btn-secondary-bg-hover)',
          'text-hover': 'var(--btn-secondary-text-hover)',
        },
        // --- Chart Series Colors ---
        'chart-teal-dark':  'var(--color-chart-teal-dark)',
        'chart-teal':       'var(--color-chart-teal)',
        'chart-teal-light': 'var(--color-chart-teal-light)',
        'chart-mauve':      'var(--color-chart-mauve)',
        'chart-pink-light': 'var(--color-chart-pink-light)',

        link:        'var(--color-link)',
        'text-heading': 'var(--color-text-heading)',
        'text-dark':    'var(--color-text-dark)',
        'text-mid':     'var(--color-text-mid)',
        'text-muted':   'var(--color-text-muted)',
        'text-body':    'var(--color-text-body)',
        exec: {
          'icon-bg':      'var(--color-exec-icon-bg)',
          'row-bg':       'var(--color-exec-row-bg)',
          'new-badge-bg': 'var(--color-exec-new-badge-bg)',
        },

        // --- Error / Form State Colors ---
        'error-bg':     'var(--color-error-bg)',
        'error-border': 'var(--color-error-border)',
        'error-text':   'var(--color-error-text)',
        'error-icon':   'var(--color-error-icon)',

        // --- Links ---
        'link-bright': 'var(--color-link-bright)',

        // --- SubNav / Tab Extras ---
        'tab-inactive': 'var(--color-tab-inactive)',
        'subnav-meta':  'var(--color-subnav-meta)',
        'near-black':   'var(--color-text-near-black)',

        // --- Section UI ---
        'section-divider': 'var(--color-section-divider)',
        'section-title':   'var(--color-section-title-bg)',

        // --- SWOT Category Colors ---
        swot: {
          'strengths-border':     'var(--color-swot-strengths-border)',
          'strengths-bg':         'var(--color-swot-strengths-bg)',
          'strengths-text':       'var(--color-swot-strengths-text)',
          'weaknesses-border':    'var(--color-swot-weaknesses-border)',
          'weaknesses-bg':        'var(--color-swot-weaknesses-bg)',
          'weaknesses-text':      'var(--color-swot-weaknesses-text)',
          'opportunities-border': 'var(--color-swot-opportunities-border)',
          'opportunities-bg':     'var(--color-swot-opportunities-bg)',
          'opportunities-text':   'var(--color-swot-opportunities-text)',
          'threats-border':       'var(--color-swot-threats-border)',
          'threats-bg':           'var(--color-swot-threats-bg)',
          'threats-text':         'var(--color-swot-threats-text)',
        },

        // --- Strategic Imperative Card Schemes ---
        'si-card': {
          'orange-bg':     'var(--color-si-card-orange-bg)',
          'orange-border': 'var(--color-si-card-orange-border)',
          'orange-badge':  'var(--color-si-card-orange-badge)',
          'blue-bg':       'var(--color-si-card-blue-bg)',
          'blue-border':   'var(--color-si-card-blue-border)',
          'blue-badge':    'var(--color-si-card-blue-badge)',
          'teal-bg':       'var(--color-si-card-teal-bg)',
          'teal-border':   'var(--color-si-card-teal-border)',
          'teal-badge':    'var(--color-si-card-teal-badge)',
        },

        // --- Gap Priority & Urgency Badges ---
        'gap-priority': {
          'high-bg':   'var(--color-gap-priority-high-bg)',
          'medium-bg': 'var(--color-gap-priority-medium-bg)',
          'low-bg':    'var(--color-gap-priority-low-bg)',
          'low-text':  'var(--color-gap-priority-low-text)',
        },
        'gap-urgency': {
          bg:   'var(--color-gap-urgency-bg)',
          text: 'var(--color-gap-urgency-text)',
        },

        // --- KDM Priority Badges ---
        'kdm-priority': {
          'high-bg':     'var(--color-kdm-priority-high-bg)',
          'high-text':   'var(--color-kdm-priority-high-text)',
          'medium-bg':   'var(--color-kdm-priority-medium-bg)',
          'medium-text': 'var(--color-kdm-priority-medium-text)',
          'low-bg':      'var(--color-kdm-priority-low-bg)',
          'low-text':    'var(--color-kdm-priority-low-text)',
          'sp-bg':       'var(--color-kdm-priority-sp-bg)',
          'sp-text':     'var(--color-kdm-priority-sp-text)',
        },

        // --- Shared Tag Colors ---
        tag: {
          'teal-bg':     'var(--color-tag-teal-bg)',
          'teal-text':   'var(--color-tag-teal-text)',
          'violet-bg':   'var(--color-tag-violet-bg)',
          'violet-text': 'var(--color-tag-violet-text)',
          'indigo-bg':   'var(--color-tag-indigo-bg)',
          'indigo-text': 'var(--color-tag-indigo-text)',
          'pink-bg':     'var(--color-tag-pink-bg)',
          'pink-text':   'var(--color-tag-pink-text)',
          'cyan-bg':     'var(--color-tag-cyan-bg)',
          'cyan-text':   'var(--color-tag-cyan-text)',
          'rose-bg':     'var(--color-tag-rose-bg)',
          'rose-text':   'var(--color-tag-rose-text)',
        },

        // --- MOA Overview Section Icon Backgrounds ---
        moa: {
          'molecular-bg':  'var(--color-moa-molecular-bg)',
          'pattern-bg':    'var(--color-moa-pattern-bg)',
          'landscape-bg':  'var(--color-moa-landscape-bg)',
        },

        // --- Disease Pathophysiology Section Card Backgrounds ---
        section: {
          'etiology-bg':    'var(--color-section-etiology-bg)',
          'symptoms-bg':    'var(--color-section-symptoms-bg)',
          'prevalence-bg':  'var(--color-section-prevalence-bg)',
          'diagnosis-bg':   'var(--color-section-diagnosis-bg)',
          'patients-bg':    'var(--color-section-patients-bg)',
          'specialists-bg': 'var(--color-section-specialists-bg)',
          'treatments-bg':  'var(--color-section-treatments-bg)',
        },

        // --- Asset Card Tag Colors ---
        'asset-tag': {
          '1-bg':   'var(--color-asset-tag-1-bg)',
          '1-text': 'var(--color-asset-tag-1-text)',
          '2-bg':   'var(--color-asset-tag-2-bg)',
          '2-text': 'var(--color-asset-tag-2-text)',
          '3-bg':   'var(--color-asset-tag-3-bg)',
          '3-text': 'var(--color-asset-tag-3-text)',
          '4-bg':   'var(--color-asset-tag-4-bg)',
          '4-text': 'var(--color-asset-tag-4-text)',
          '5-bg':   'var(--color-asset-tag-5-bg)',
          '5-text': 'var(--color-asset-tag-5-text)',
        },
      },
      fontFamily: {
        sans:    'var(--font-sans)',
        heading: 'var(--font-heading)',
        ui:      'var(--font-ui)',
      },
      fontSize: {
        xs:            'var(--text-xs)',
        sm:            'var(--text-sm)',
        'card-title':  'var(--text-card-title)',
        'detail-link': 'var(--text-detail-link)',
        base: 'var(--text-base)',
        lg:   'var(--text-lg)',
        xl:   'var(--text-xl)',
        '2xl':'var(--text-2xl)',
        '3xl':'var(--text-3xl)',
        '4xl':'var(--text-4xl)',
      },
      fontWeight: {
        normal:   'var(--font-normal)',
        medium:   'var(--font-medium)',
        semibold: 'var(--font-semibold)',
        bold:     'var(--font-bold)',
      },
    },
  },
  safelist: [
    'bg-gap-priority-high-bg',
    'bg-gap-priority-medium-bg',
    'bg-gap-priority-low-bg',
    'text-gap-priority-low-text',
    'bg-gap-urgency-bg',
    'text-gap-urgency-text',
  ],
  plugins: [],
}
