// Test file to validate megacorp-connect command syntax
const testCommand = {
  "megacorp-connect": {
    description: "Connect to MegaCorp Product X Portal",
    usage: "megacorp-connect",
    execute: () => {
      // Check if already connected
      if (megacorpConnected) {
        return [
          { type: "error", content: "Already connected to MegaCorp Portal." },
          { type: "system", content: `Access level: ${megacorpAccessLevel}` },
          { type: "system", content: 'Use "megacorp-disconnect" to logout.' }
        ];
      }

      // Return login selection
      return [
        { type: "system", content: "═══════════════════════════════════════════════" },
        { type: "system", content: "   MEGACORP PRODUCT X TESTING PORTAL" },
        { type: "system", content: "   Secure Connection Established" },
        { type: "system", content: "═══════════════════════════════════════════════" },
        { type: "system", content: "" },
        { type: "system", content: "Login Type:" },
        { type: "system", content: "  [1] Test Subject Portal" },
        { type: "system", content: "  [2] Employee Portal" },
        { type: "system", content: "" },
        {
          type: "input",
          content: "Select (1 or 2): ",
          waitForInput: true,
          callback: (selection) => {
            // Option 1: Subject Portal
            if (selection === "1") {
              return [
                { type: "echo", content: selection },
                { type: "system", content: "" },
                { type: "system", content: "TEST SUBJECT PORTAL LOGIN" },
                {
                  type: "input",
                  content: "Subject ID: ",
                  waitForInput: true,
                  callback: (username) => {
                    return [
                      { type: "echo", content: username },
                      {
                        type: "input",
                        content: "Password: ",
                        waitForInput: true,
                        passwordMode: true,
                        callback: (password) => {
                          if (username.toLowerCase() === "subject47" && password === "productx2024") {
                            setMegacorpConnected(true);
                            setMegacorpAccessLevel("subject");

                            return [
                              { type: "system", content: "" },
                              { type: "system", content: "✓ Authentication successful" },
                              { type: "system", content: "" },
                              { type: "system", content: "Welcome, Test Subject #47 (Alex Pell)" },
                              { type: "system", content: "Testing Status: ACTIVE" },
                              { type: "system", content: "Device Usage: 246 hours" },
                              { type: "system", content: "" },
                              { type: "system", content: "Health Status: NORMAL" },
                              { type: "system", content: "Recent Symptoms: Minor discomfort (expected)" },
                              { type: "system", content: "" },
                              { type: "system", content: 'Type "megacorp-disconnect" to logout' }
                            ];
                          } else {
                            return [
                              { type: "system", content: "" },
                              { type: "error", content: "✗ Authentication failed" },
                              { type: "error", content: "Invalid subject ID or password" },
                              { type: "system", content: "" },
                              { type: "system", content: "Connection terminated." }
                            ];
                          }
                        }
                      }
                    ];
                  }
                }
              ];
            }
            // Option 2: Employee Portal
            else if (selection === "2") {
              return [
                { type: "echo", content: selection },
                { type: "system", content: "" },
                { type: "system", content: "EMPLOYEE PORTAL LOGIN" },
                { type: "system", content: "⚠ Authorized Personnel Only" },
                {
                  type: "input",
                  content: "Employee ID: ",
                  waitForInput: true,
                  callback: (username) => {
                    return [
                      { type: "echo", content: username },
                      {
                        type: "input",
                        content: "Password: ",
                        waitForInput: true,
                        passwordMode: true,
                        callback: (password) => {
                          if (password === "s4ngu1s") {
                            setMegacorpConnected(true);
                            setMegacorpAccessLevel("employee");

                            return [
                              { type: "system", content: "" },
                              { type: "system", content: "✓ Authentication successful" },
                              { type: "system", content: "" },
                              { type: "system", content: `Welcome, ${username}` },
                              { type: "system", content: "⚠ EMPLOYEE ACCESS GRANTED ⚠" },
                              { type: "system", content: "" },
                              { type: "system", content: "SUBJECT #47 - ALEX PELL" },
                              { type: "system", content: "Status: ACTIVE MONITORING" },
                              { type: "system", content: "Risk Level: MODERATE" },
                              { type: "system", content: "" },
                              { type: "system", content: "Blood Analysis: Protein Marker X-7 ELEVATED (450%)" },
                              { type: "system", content: "Neural Indicators: ABNORMAL PATTERNS" },
                              { type: "system", content: "" },
                              { type: "system", content: "Dr. Sanguis Assessment:" },
                              { type: "system", content: "Device IS having biological effects." },
                              { type: "system", content: "Do NOT acknowledge connection to subject." },
                              { type: "system", content: "" },
                              { type: "system", content: 'Type "megacorp-disconnect" to logout' }
                            ];
                          } else {
                            return [
                              { type: "system", content: "" },
                              { type: "error", content: "✗ Authentication failed" },
                              { type: "error", content: "Invalid employee credentials" },
                              { type: "system", content: "" },
                              { type: "system", content: "Hint: Password related to blood research..." },
                              { type: "system", content: "Connection terminated." }
                            ];
                          }
                        }
                      }
                    ];
                  }
                }
              ];
            }
            // Invalid selection
            else {
              return [
                { type: "echo", content: selection },
                { type: "error", content: "Invalid selection. Connection terminated." }
              ];
            }
          }
        }
      ];
    }
  }
};

console.log("Syntax valid!");
