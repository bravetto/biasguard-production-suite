// BiasGuard Chat Button Injector - JAHmere Webb Mission Enhanced
;(() => {
  // 🔄 PATTERN TRACKING - Prevent neural howlround
  let recentPatterns = []
  let recentInputs = []
  
  function findChatInput() {
    const selectors = ['textarea[placeholder*="message"]','textarea[placeholder*="chat"]','textarea[placeholder*="ask"]','div[contenteditable="true"]','.chat-input','.message-input','[data-testid*="chat"]','[role="textbox"]']
    for (const selector of selectors) {
      const element = document.querySelector(selector)
      if (element) return element
    }
    return null
  }
  
  function quickBias(text) {
    let score = 0
    const problems = []
    
    // 🚫 SCOPE PROTECTION - Block accessibility pattern detection
    if (/accessibility|contrast|gradient|WCAG|bg-gradient|color.?theory|typography|visual.?design|ui.?pattern/i.test(text)) {
      return `[BiasGuard JAHmere] 🚫 SCOPE VIOLATION\nAccessibility patterns detected. BiasGuard focuses on engineering bias detection only.\n\n💡 For accessibility issues, use dedicated accessibility tools.`
    }
    
    // 🔄 LOOP PREVENTION - Block recursive analysis patterns
    if (/analysis.?of.?analysis|meta.?analysis|recursive.?review|bias.?of.?bias|biasguard.?bias|analyzing.?the.?analysis|assessment.?of.?assessment|review.?of.?review/i.test(text)) {
      return `[BiasGuard JAHmere] 🔄 ANALYSIS LOOP DETECTED\nRecursive analysis pattern detected. Returning to original engineering problem.\n\n💡 Focus on implementation, not analysis of analysis.`
    }
    
    // 🔄 HOWLROUND PREVENTION - Detect repetitive patterns
    const inputHash = text.toLowerCase().replace(/\s+/g, ' ').trim()
    if (recentInputs.includes(inputHash)) {
      return `[BiasGuard JAHmere] 🔄 PATTERN LOOP DETECTED\nRepeated input detected. Varying analysis to prevent bias reinforcement.\n\n💡 Try rephrasing or analyzing different content.`
    }
    
    // Track recent inputs (keep last 5)
    recentInputs.push(inputHash)
    if (recentInputs.length > 5) recentInputs.shift()
    
    // 🎯 MISSION-CRITICAL PATTERNS (JAHmere Webb Project)
    if (/court.?date/i.test(text)) { 
      score += 35; problems.push('⏰ PRESSURE - Stay focused on deliverables') 
    }
    if (/perfect|ideal|comprehensive/i.test(text)) { 
      score += 30; problems.push('🎯 PERFECTIONISM - Ship functional over perfect') 
    }
    if (/refactor|rebuild|rewrite/i.test(text)) { 
      score += 40; problems.push('🚫 REWRITE TRAP - Improve existing, don\'t restart') 
    }
    
    // 🔧 TECHNICAL BIAS PATTERNS
    if (/roadm|timel|miles/i.test(text)) { score += 30; problems.push('📅 Planning Fallacy') }
    if (/compreh|framew|enterp/i.test(text)) { score += 25; problems.push('🏗️ Feature Creep') }
    if (/mandato/i.test(text)) { score += 20; problems.push('👑 Authority Bias') }
    if (/obvious|simpl|easil/i.test(text)) { score += 15; problems.push('🤔 Assumption Bias') }
    
    // 🎲 DIVERSITY INJECTION - Ensure varied bias detection
    const diversityBiases = [
      { pattern: /sunk.?cost|already.?spent|invested.?time/i, message: '💸 SUNK COST FALLACY - Past investment doesn\'t justify continuing' },
      { pattern: /not.?invented.?here|external.?solution|third.?party/i, message: '🏠 NOT INVENTED HERE - Consider proven external solutions' },
      { pattern: /premature.?optim|performance.?first|micro.?optim/i, message: '⚡ PREMATURE OPTIMIZATION - Profile before optimizing' },
      { pattern: /analysis.?paralysis|more.?research|need.?to.?study/i, message: '🔄 ANALYSIS PARALYSIS - Start with MVP and iterate' }
    ]
    
    // Apply diversity patterns (rotate to prevent fixation)
    const currentTime = Math.floor(Date.now() / 60000) // Change every minute
    const selectedBias = diversityBiases[currentTime % diversityBiases.length]
    if (selectedBias.pattern.test(text)) {
      score += 20; problems.push(selectedBias.message)
    }
    
    // 🎨 DESIGN SYSTEM PATTERNS
    if (/animation|transition|effect/i.test(text)) { 
      score += 20; problems.push('✨ ANIMATION TRAP - CSS-only, performance first') 
    }
    if (/component.?librar|ui.?kit/i.test(text)) { 
      score += 25; problems.push('📦 COMPONENT BLOAT - Use existing Tailwind patterns') 
    }
    
    // 🛡️ MISSION ALIGNMENT CHECK
    if (!/letter|witness|judge|freedom|support|engineering|development|code|bias|technical|architecture|implementation|solution|fix|build/i.test(text) && text.length > 100) {
      score += 25; problems.push('🎯 MISSION DRIFT - Focus on JAHmere Webb engineering decisions and bias detection')
    }
    
    // 🔄 ANALYSIS DRIFT CHECK - Penalize excessive analysis without action
    if ((/analysis|assessment|evaluation|review/i.test(text) && text.length > 80) && !/implement|fix|build|deploy|code|solution/i.test(text)) {
      score += 30; problems.push('🔄 ANALYSIS DRIFT - Too much analysis, not enough action')
    }
    
    // 🎚️ CONFIDENCE LIMITING - Prevent overconfidence bias
    const maxScore = Math.min(score, 85) // Never claim >85% certainty
    if (score > maxScore) {
      problems.push('🎚️ CONFIDENCE LIMITED - Maintaining healthy uncertainty')
    }
    
    const level = maxScore < 30 ? '🟢 GOOD' : maxScore < 60 ? '🟡 BIAS' : '🔴 FIX'
    const missionContext = problems.some(p => p.includes('⏰') || p.includes('🎯')) ? '\n🚨 MISSION-CRITICAL BIAS DETECTED' : ''
    
    return `[BiasGuard JAHmere] ${level} (${maxScore}%)\n${problems.join(' | ')}${missionContext}`
  }
  
  function createBiasGuardButton() {
    const btn = document.createElement('button')
    btn.innerHTML = '🛡️'
    btn.title = 'BiasGuard JAHmere - Engineering bias detection ONLY (not accessibility)'
    btn.style.cssText = `background:linear-gradient(45deg,#2563eb,#7c3aed);color:white;border:none;border-radius:6px;padding:8px 12px;margin:0 5px;cursor:pointer;font-size:14px;font-weight:bold;box-shadow:0 4px 12px rgba(37,99,235,0.3);transition:all 0.2s;position:relative`
    
    // Mission indicator pulse
    const pulse = document.createElement('div')
    pulse.style.cssText = `position:absolute;top:-2px;right:-2px;width:8px;height:8px;background:#ea580c;border-radius:50%;animation:missionPulse 2s infinite`
    btn.appendChild(pulse)
    
    // Add pulse animation
    if (!document.getElementById('biasguard-styles')) {
      const style = document.createElement('style')
      style.id = 'biasguard-styles'
      style.textContent = `
        @keyframes missionPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `
      document.head.appendChild(style)
    }
    
    btn.onmouseover = () => { 
      btn.style.background = 'linear-gradient(45deg,#1d4ed8,#6d28d9)'
      btn.style.transform = 'translateY(-1px)'
    }
    btn.onmouseout = () => { 
      btn.style.background = 'linear-gradient(45deg,#2563eb,#7c3aed)'
      btn.style.transform = 'translateY(0)'
    }
    
    btn.onclick = () => {
      const text = prompt('🛡️ BiasGuard JAHmere Analysis\n\nEnter text to analyze for mission-critical bias patterns:')
      if (!text) return
      
      const result = quickBias(text)
      const chatInput = findChatInput()
      
      if (chatInput) {
        if (chatInput.tagName === 'TEXTAREA') {
          chatInput.value = result
          chatInput.dispatchEvent(new Event('input', { bubbles: true }))
        } else if (chatInput.contentEditable === 'true') {
          chatInput.textContent = result
          chatInput.dispatchEvent(new Event('input', { bubbles: true }))
        }
        chatInput.focus()
      } else {
        navigator.clipboard.writeText(result).then(() => {
          alert('🛡️ BiasGuard JAHmere Analysis copied to clipboard!\n\n' + result)
        })
      }
    }
    return btn
  }
  
  function addToChat() {
    const chatInput = findChatInput()
    if (!chatInput) { setTimeout(addToChat, 1000); return }
    const existing = document.getElementById('biasguard-chat-btn')
    if (existing) existing.remove()
    const btn = createBiasGuardButton()
    btn.id = 'biasguard-chat-btn'
    const parent = chatInput.parentElement
    if (parent) {
      const toolbar = parent.querySelector('[class*="toolbar"], [class*="button"], [class*="action"]')
      if (toolbar) { toolbar.appendChild(btn) } else { parent.insertBefore(btn, chatInput.nextSibling) }
    } else {
      btn.style.position = 'fixed'
      btn.style.bottom = '20px'
      btn.style.right = '20px'
      btn.style.zIndex = '9999'
      document.body.appendChild(btn)
    }
  }
  
  addToChat()
  const observer = new MutationObserver(() => { if (!document.getElementById('biasguard-chat-btn')) { addToChat() } })
  observer.observe(document.body, { childList: true, subtree: true })
})()