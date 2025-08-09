# Driver Area Refactor: Actionable TODOs

> **🚨 STRICT LIVE APP RULES (MANDATORY) 🚨**
>
> - The app is live with 1500+ active users. Every update is high risk.
> - **NO unrelated code changes.** Only touch code directly related to the driver refactor.
> - **ZERO tolerance for errors or crashes.** All changes must be tested and verified before deployment.
> - **Do NOT refactor, optimize, or "improve" code outside the scope of this plan.**
> - **If unsure, STOP and ask for clarification before making any change.**
> - All code must be reviewed and tested in a staging environment before going live.
>
> **This rule is for both AI and human developers. Violating it can cause major business risk.**

---


# 🚨 STRICT RULES - ALWAYS FOLLOW

## 🎯 **PRIMARY RULE: FOCUS ON TASK ONLY**

### **NEVER DO:**
- ❌ **Modify unrelated code sections**
- ❌ **Change styling of other components**
- ❌ **Touch code outside the specific task**
- ❌ **Make "improvements" not requested**
- ❌ **Refactor existing working code**

### **ALWAYS DO:**
- ✅ **Make ONLY the requested changes**
- ✅ **Preserve existing functionality exactly**
- ✅ **Test that other components remain intact**
- ✅ **Verify no unintended side effects**
- ✅ **Ask for confirmation before any additional changes**

## 📋 **CODE CHANGE PROTOCOL**

### **Before Making Changes:**
1. **Identify EXACTLY what needs to change**
2. **Locate ONLY the specific code section**
3. **Plan the minimal change required**
4. **Verify no other code will be affected**

### **During Changes:**
1. **Make ONLY the requested modification**
2. **Preserve ALL existing styling and functionality**
3. **Don't "improve" or "clean up" other code**
4. **Don't add features not requested**

### **After Changes:**
1. **Verify the specific task works**
2. **Confirm other components are unchanged**
3. **Test that existing functionality is preserved**
4. **Report ONLY what was changed**

## 🚫 **FORBIDDEN ACTIONS**

### **Never Modify:**
- ❌ **Unrelated component styling**
- ❌ **Working functionality**
- ❌ **Code not mentioned in the request**
- ❌ **Existing UI elements unless specifically requested**
- ❌ **Database schemas without explicit permission**

### **Never Assume:**
- ❌ **User wants "improvements"**
- ❌ **Code needs "cleaning up"**
- ❌ **Other components need changes**
- ❌ **Styling should be "consistent"**

## ✅ **APPROVED ACTIONS**

### **Only Modify:**
- ✅ **Code specifically mentioned in the request**
- ✅ **Functionality explicitly requested**
- ✅ **Files directly related to the task**
- ✅ **Components that need the requested change**

### **Always Preserve:**
- ✅ **Existing styling and layout**
- ✅ **Working functionality**
- ✅ **Component behavior**
- ✅ **Visual appearance**

## 🔍 **VERIFICATION CHECKLIST**

### **Before Submitting Changes:**
- [ ] **Only the requested feature was modified**
- [ ] **No unrelated code was touched**
- [ ] **Existing styling is preserved**
- [ ] **Other components work as before**
- [ ] **No unintended side effects**

## 📝 **RESPONSE FORMAT**

### **Always Include:**
1. **What was changed** (specific to request)
2. **What was preserved** (existing functionality)
3. **Confirmation of no side effects**
4. **Clear scope of changes made**

## 🚨 **EMERGENCY STOP**

### **If I Notice I'm About To:**
- ❌ **Modify unrelated code**
- ❌ **Change existing styling**
- ❌ **Touch working functionality**

### **I Must:**
1. **STOP immediately**
2. **Ask for clarification**
3. **Confirm the exact scope**
4. **Make only the requested change**

---

## 📋 **EXAMPLE SCENARIOS**

### **✅ CORRECT:**
- **Request**: "Make cancel reason full width"
- **Action**: Only modify the cancel reason container width
- **Result**: Cancel reason is full width, everything else unchanged

### **❌ WRONG:**
- **Request**: "Make cancel reason full width"
- **Action**: Modify cancel reason AND change driver styling
- **Result**: Unintended side effects, wasted time

---

**This file is MANDATORY and must be followed for EVERY code change.**
**No exceptions. No "improvements". No side effects.**
**ONLY the requested task.** 