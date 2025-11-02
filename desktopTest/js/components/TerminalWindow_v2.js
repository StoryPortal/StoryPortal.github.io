// js/components/TerminalWindow.js
const { useState, useRef, useEffect } = React;
const { createElement: e } = React;

import { WindowFrame } from "./WindowFrame.js";

// Terminal Content Component - Separated from window frame
const TerminalContent = ({ isMaximized, windowSize }) => {
  const [commandHistory, setCommandHistory] = useState([]);
  const [currentCommand, setCurrentCommand] = useState("");
  const [terminalOutput, setTerminalOutput] = useState([
    { type: "system", content: "MegaCorp Secure Terminal v3.9.2" },
    { type: "system", content: "© 2024 MegaCorp Advanced Technologies" },
    { type: "system", content: 'Type "help" for available commands.' },
  ]);
  const [accessLevel, setAccessLevel] = useState("user");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [currentDirectory, setCurrentDirectory] = useState("~");
  const [showCursor, setShowCursor] = useState(true);

  // MegaCorp server connection state
  const [megacorpConnected, setMegacorpConnected] = useState(false);
  const [megacorpAccessLevel, setMegacorpAccessLevel] = useState(null);

  // File system structure
  const [fileSystem, setFileSystem] = useState({
    "~": {
      type: "directory",
      content: {
        documents: {
          type: "directory",
          content: {
            personal: {
              type: "directory",
              content: {
                "notes.txt": {
                  type: "file",
                  content:
                    "Remember to review the Product X documentation again.\nLook for any references to side effects or health warnings.\nPassword for secure portal: s4ngu1s\n\nAccessing MegaCorp systems:\n1. Navigate to the megacorp directory\n2. Run the access portal script with connection flag\n3. Use the password above when prompted",
                },
                "symptoms.txt": {
                  type: "file",
                  content:
                    "Day 12: Tingling in fingers persists.\nDay 15: Headaches are getting worse after extended use.\nDay 23: Strange dreams. Chest pain?",
                },
              },
            },
            megacorp: {
              type: "directory",
              content: {
                "product_x_notes.txt": {
                  type: "file",
                  content:
                    'Testing notes for internal review only.\n\nIntermittent connection issues with neural interface.\nUser reports of "phantom sensations" should be monitored but are within expected parameters.\nCONFIDENTIAL: If users report chest pain, document but do not acknowledge connection to device.\n\nNOTE: To access the full testing database, run the portal access script with proper connection flags.',
                },
                "access_portal.sh": {
                  type: "executable",
                  content:
                    "Executable script: MegaCorp Secure Portal Access\nUse with --help for more information.",
                  execute: (args) => {
                    if (args.includes("--help")) {
                      return [
                        {
                          type: "system",
                          content: "MegaCorp Secure Portal Access",
                        },
                        {
                          type: "system",
                          content: "Usage: ./access_portal.sh [OPTIONS]",
                        },
                        { type: "system", content: "Options:" },
                        {
                          type: "system",
                          content:
                            "  --connect    Attempt connection to secure portal",
                        },
                        {
                          type: "system",
                          content: "  --help       Display this help message",
                        },
                      ];
                    }

                    if (args.includes("--connect")) {
                      return [
                        {
                          type: "system",
                          content:
                            "Attempting to connect to MegaCorp Secure Portal...",
                        },
                        { type: "system", content: "Authentication required." },
                        {
                          type: "input",
                          content: "Username: ",
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
                                    return [
                                      {
                                        type: "system",
                                        content: "Authentication successful.",
                                      },
                                      {
                                        type: "system",
                                        content:
                                          "Welcome to MegaCorp Secure Portal, Alex.",
                                      },
                                      {
                                        type: "system",
                                        content: "Loading user data...",
                                      },
                                      {
                                        type: "system",
                                        content:
                                          "ALERT: Unauthorized access to Product X test subject data detected.",
                                      },
                                      {
                                        type: "system",
                                        content:
                                          "Loading restricted content...",
                                      },
                                      {
                                        type: "system",
                                        content:
                                          "=================================",
                                      },
                                      {
                                        type: "system",
                                        content:
                                          "PRODUCT X - TEST SUBJECT #47 (PELL, A.)",
                                      },
                                      {
                                        type: "system",
                                        content: "STATUS: ACTIVE",
                                      },
                                      {
                                        type: "system",
                                        content: "DEVICE USAGE: 246 HOURS",
                                      },
                                      {
                                        type: "system",
                                        content: "REPORTED SYMPTOMS:",
                                      },
                                      {
                                        type: "system",
                                        content:
                                          "- Tingling in extremities (EXPECTED)",
                                      },
                                      {
                                        type: "system",
                                        content: "- Headaches (EXPECTED)",
                                      },
                                      {
                                        type: "system",
                                        content:
                                          "- Chest pain (MONITOR CLOSELY)",
                                      },
                                      {
                                        type: "system",
                                        content:
                                          "- Sleep disturbances (EXPECTED)",
                                      },
                                      {
                                        type: "system",
                                        content:
                                          "MEDICAL EVALUATION: Subject displays psychosomatic response patterns.",
                                      },
                                      {
                                        type: "system",
                                        content:
                                          "RECOMMENDATION: Continue monitoring. Do not acknowledge connection to device.",
                                      },
                                      {
                                        type: "system",
                                        content:
                                          "=================================",
                                      },
                                      {
                                        type: "system",
                                        content:
                                          "NOTICE: This access has been logged and reported to MegaCorp Security.",
                                      },
                                      {
                                        type: "system",
                                        content: "Connection terminated.",
                                      },
                                    ];
                                  } else {
                                    return [
                                      {
                                        type: "error",
                                        content:
                                          "Authentication failed. Incorrect password.",
                                      },
                                      {
                                        type: "error",
                                        content: "Connection terminated.",
                                      },
                                    ];
                                  }
                                },
                              },
                            ];
                          },
                        },
                      ];
                    }

                    // If no options provided, give a hint
                    if (args.length === 0) {
                      return [
                        {
                          type: "system",
                          content: "MegaCorp Secure Portal Access",
                        },
                        { type: "error", content: "No options specified." },
                        {
                          type: "system",
                          content: "Try: ./access_portal.sh --help",
                        },
                      ];
                    }

                    return [
                      {
                        type: "error",
                        content:
                          "Invalid option. Use --help for usage information.",
                      },
                    ];
                  },
                },
              },
            },
          },
        },
        hidden: {
          type: "directory",
          hidden: true,
          content: {
            "megacorp_contract.pdf": {
              type: "file",
              content: "Binary file: Product X Testing Agreement and NDA",
            },
          },
        },
        ".secret": {
          type: "directory",
          hidden: true,
          content: {
            "portal_access.key": {
              type: "file",
              content:
                "-----BEGIN ENCRYPTED KEY-----\nThis key grants access to MegaCorp internal systems.\nThe blood is the key. Remember Sanguis.\n-----END ENCRYPTED KEY-----",
            },
          },
        },
      },
    },
  });

  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Commands available in the terminal
  const commands = {
    help: {
      description: "Display available commands",
      usage: "help",
      execute: () => {
        return [
          { type: "system", content: "Available commands:" },
          ...Object.entries(commands).map(([name, cmd]) => {
            return {
              type: "system",
              content: `  ${name.padEnd(18)} - ${cmd.description}`,
            };
          }),
        ];
      },
    },

    "megacorp-connect": {
      description: "Connect to MegaCorp Product X Portal",
      usage: "megacorp-connect",
      execute: () => {
        if (megacorpConnected) {
          return [
            { type: "error", content: "Already connected to MegaCorp Portal." },
            { type: "system", content: `Access level: ${megacorpAccessLevel}` },
            { type: "system", content: 'Use "megacorp-disconnect" to logout.' },
          ];
        }

        return [
          {
            type: "system",
            content: "═══════════════════════════════════════════════",
          },
          { type: "system", content: "   MEGACORP PRODUCT X TESTING PORTAL" },
          { type: "system", content: "   Secure Connection Established" },
          {
            type: "system",
            content: "═══════════════════════════════════════════════",
          },
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
                            if (
                              username.toLowerCase() === "subject47" &&
                              password === "productx2024"
                            ) {
                              setMegacorpConnected(true);
                              setMegacorpAccessLevel("subject");

                              return [
                                { type: "system", content: "" },
                                {
                                  type: "system",
                                  content: "✓ Authentication successful",
                                },
                                { type: "system", content: "" },
                                {
                                  type: "system",
                                  content:
                                    "Welcome, Test Subject #47 (Alex Pell)",
                                },
                                {
                                  type: "system",
                                  content: "Testing Status: ACTIVE",
                                },
                                {
                                  type: "system",
                                  content: "Device Usage: 246 hours",
                                },
                                { type: "system", content: "" },
                                {
                                  type: "system",
                                  content: "Health Status: NORMAL",
                                },
                                {
                                  type: "system",
                                  content:
                                    "Recent Symptoms: Minor discomfort (expected)",
                                },
                                { type: "system", content: "" },
                                {
                                  type: "system",
                                  content:
                                    'Type "megacorp-disconnect" to logout',
                                },
                              ];
                            } else {
                              return [
                                { type: "system", content: "" },
                                {
                                  type: "error",
                                  content: "✗ Authentication failed",
                                },
                                {
                                  type: "error",
                                  content: "Invalid subject ID or password",
                                },
                                { type: "system", content: "" },
                                {
                                  type: "system",
                                  content: "Connection terminated.",
                                },
                              ];
                            }
                          },
                        },
                      ];
                    },
                  },
                ];
              } else if (selection === "2") {
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
                                {
                                  type: "system",
                                  content: "✓ Authentication successful",
                                },
                                { type: "system", content: "" },
                                {
                                  type: "system",
                                  content: `Welcome, ${username}`,
                                },
                                {
                                  type: "system",
                                  content: "⚠ EMPLOYEE ACCESS GRANTED ⚠",
                                },
                                { type: "system", content: "" },
                                {
                                  type: "system",
                                  content: "SUBJECT #47 - ALEX PELL",
                                },
                                {
                                  type: "system",
                                  content: "Status: ACTIVE MONITORING",
                                },
                                {
                                  type: "system",
                                  content: "Risk Level: MODERATE",
                                },
                                { type: "system", content: "" },
                                {
                                  type: "system",
                                  content:
                                    "Blood Analysis: Protein Marker X-7 ELEVATED (450%)",
                                },
                                {
                                  type: "system",
                                  content:
                                    "Neural Indicators: ABNORMAL PATTERNS",
                                },
                                { type: "system", content: "" },
                                {
                                  type: "system",
                                  content: "Dr. Sanguis Assessment:",
                                },
                                {
                                  type: "system",
                                  content:
                                    "Device IS having biological effects.",
                                },
                                {
                                  type: "system",
                                  content:
                                    "Do NOT acknowledge connection to subject.",
                                },
                                { type: "system", content: "" },
                                {
                                  type: "system",
                                  content:
                                    'Type "megacorp-disconnect" to logout',
                                },
                              ];
                            } else {
                              return [
                                { type: "system", content: "" },
                                {
                                  type: "error",
                                  content: "✗ Authentication failed",
                                },
                                {
                                  type: "error",
                                  content: "Invalid employee credentials",
                                },
                                { type: "system", content: "" },
                                {
                                  type: "system",
                                  content:
                                    "Hint: Password related to blood research...",
                                },
                                {
                                  type: "system",
                                  content: "Connection terminated.",
                                },
                              ];
                            }
                          },
                        },
                      ];
                    },
                  },
                ];
              } else {
                return [
                  { type: "echo", content: selection },
                  {
                    type: "error",
                    content: "Invalid selection. Connection terminated.",
                  },
                ];
              }
            },
          },
        ];
      },
    },

    "megacorp-disconnect": {
      description: "Disconnect from MegaCorp Portal",
      usage: "megacorp-disconnect",
      execute: () => {
        if (!megacorpConnected) {
          return [
            { type: "error", content: "Not connected to MegaCorp Portal." },
          ];
        }

        const accessLevel = megacorpAccessLevel;
        setMegacorpConnected(false);
        setMegacorpAccessLevel(null);

        return [
          { type: "system", content: "Disconnecting from MegaCorp Portal..." },
          { type: "system", content: `Logged out from ${accessLevel} portal.` },
          { type: "system", content: "Connection closed." },
        ];
      },
    },

    ls: {
      description: "List directory contents",
      usage: "ls [-a] [directory]",
      execute: (args) => {
        const showHidden = args.includes("-a") || args.includes("--all");

        let targetDir = currentDirectory;
        args = args.filter((arg) => !arg.startsWith("-"));
        if (args.length > 0) {
          targetDir = resolvePath(args[0]);
        }

        const dirObj = getPathObject(targetDir);
        if (!dirObj || dirObj.type !== "directory") {
          return [
            {
              type: "error",
              content: `ls: cannot access '${targetDir}': No such directory`,
            },
          ];
        }

        const contents = [];
        Object.entries(dirObj.content).forEach(([name, item]) => {
          if (!item.hidden || showHidden) {
            if (item.type === "directory") {
              contents.push({ type: "system", content: `${name}/` });
            } else if (item.type === "executable") {
              contents.push({ type: "system", content: `${name}*` });
            } else {
              contents.push({ type: "system", content: name });
            }
          }
        });

        return contents.length > 0
          ? contents
          : [{ type: "system", content: "No files found" }];
      },
    },

    cd: {
      description: "Change directory",
      usage: "cd [directory]",
      execute: (args) => {
        if (args.length === 0) {
          setCurrentDirectory("~");
          return [{ type: "system", content: "Changed to home directory" }];
        }

        const path = resolvePath(args[0]);
        const pathObj = getPathObject(path);

        if (!pathObj) {
          return [
            { type: "error", content: `cd: no such directory: ${args[0]}` },
          ];
        }

        if (pathObj.type !== "directory") {
          return [
            { type: "error", content: `cd: not a directory: ${args[0]}` },
          ];
        }

        setCurrentDirectory(path);
        return [];
      },
    },

    cat: {
      description: "Display file contents",
      usage: "cat <file>",
      execute: (args) => {
        if (args.length === 0) {
          return [{ type: "error", content: "cat: missing file operand" }];
        }

        const path = resolvePath(args[0]);
        const fileObj = getPathObject(path);

        if (!fileObj) {
          return [
            {
              type: "error",
              content: `cat: ${args[0]}: No such file or directory`,
            },
          ];
        }

        if (fileObj.type === "directory") {
          return [
            { type: "error", content: `cat: ${args[0]}: Is a directory` },
          ];
        }

        // Split content by newlines for better display
        const content = fileObj.content.split("\n").map((line) => {
          return { type: "system", content: line };
        });

        return content;
      },
    },

    pwd: {
      description: "Print working directory",
      usage: "pwd",
      execute: () => {
        return [{ type: "system", content: currentDirectory }];
      },
    },

    echo: {
      description: "Display a message",
      usage: "echo [message]",
      execute: (args) => {
        return [{ type: "system", content: args.join(" ") }];
      },
    },

    whoami: {
      description: "Display current user and access level",
      usage: "whoami",
      execute: () => {
        if (loggedIn) {
          return [
            { type: "system", content: `User: alex` },
            { type: "system", content: `Access Level: ${accessLevel}` },
          ];
        } else {
          return [{ type: "system", content: "User: alex (not logged in)" }];
        }
      },
    },

    find: {
      description: "Search for files",
      usage: "find <pattern>",
      execute: (args) => {
        if (args.length === 0) {
          return [{ type: "error", content: "find: missing pattern" }];
        }

        const pattern = args[0].toLowerCase();
        const results = [];

        // Recursive function to search the file system
        const searchDirectory = (dirPath, dirObj) => {
          Object.entries(dirObj.content).forEach(([name, item]) => {
            const fullPath = `${dirPath}/${name}`.replace("~/", "");

            if (name.toLowerCase().includes(pattern)) {
              if (item.type === "directory") {
                results.push({ type: "system", content: `${fullPath}/` });
              } else {
                results.push({ type: "system", content: fullPath });
              }
            }

            if (item.type === "directory") {
              searchDirectory(`${dirPath}/${name}`, item);
            } else if (
              item.type === "file" &&
              item.content.toLowerCase().includes(pattern)
            ) {
              results.push({
                type: "system",
                content: `${fullPath}: matches content`,
              });
            }
          });
        };

        // Start search from root
        searchDirectory("~", fileSystem["~"]);

        return results.length > 0
          ? [
              {
                type: "system",
                content: `Found ${results.length} matches for '${pattern}':`,
              },
              ...results,
            ]
          : [{ type: "system", content: `No matches found for '${pattern}'` }];
      },
    },

    login: {
      description: "Login to the terminal with elevated privileges",
      usage: "login [username]",
      execute: (args) => {
        if (loggedIn) {
          return [
            {
              type: "system",
              content:
                "You are already logged in as user with level " +
                accessLevel +
                " privileges.",
            },
          ];
        }

        const username = args.length > 0 ? args[0] : "alex";

        return [
          { type: "system", content: `Login authentication for ${username}` },
          {
            type: "input",
            content: "Password: ",
            waitForInput: true,
            passwordMode: true,
            callback: (password) => {
              if (password === "s4ngu1s") {
                setLoggedIn(true);
                setAccessLevel("admin");

                // Modify file system to reveal hidden MegaCorp data
                setFileSystem((prevFileSystem) => {
                  const newFileSystem = JSON.parse(
                    JSON.stringify(prevFileSystem),
                  );

                  // Add a new hidden directory with secured files that only become visible after login
                  newFileSystem["~"].content[".megacorp_secure"] = {
                    type: "directory",
                    hidden: false, // Now visible after login
                    content: {
                      "product_x_database.dat": {
                        type: "file",
                        content:
                          "PRODUCT X - SUBJECT TESTING DATABASE\n" +
                          "====================================\n" +
                          "Subject #42 (MEYER, T.) - DISCONTINUED - Blood enzyme levels abnormal\n" +
                          "Subject #45 (PARKER, J.) - ACTIVE - Reporting mild discomfort\n" +
                          "Subject #47 (PELL, A.) - ACTIVE - Subject reporting chest pains, possible psychosomatic\n" +
                          "Subject #51 (RHODES, K.) - DISCONTINUED - Subject violated testing protocol\n\n" +
                          'SECURITY LEVEL 1 ACCESS GRANTED - For full subject histories use "access_portal.sh"',
                      },
                      "internal_memo.txt": {
                        type: "file",
                        content:
                          "FROM: Dr. Sanguis\nTO: Research Team\nSUBJECT: Test Subject Monitoring\n\n" +
                          "Team,\n\n" +
                          "Several test subjects have reported similar symptoms (headaches, tingling, chest discomfort). " +
                          "Our official position remains that these are coincidental or psychosomatic in nature. " +
                          "Do NOT acknowledge any potential connection to the device in your communications.\n\n" +
                          "Subject #47 (Pell) has been particularly persistent about symptoms. " +
                          "Medical scans show unusual activity but nothing conclusive. " +
                          "Continue to monitor but maintain the official line.\n\n" +
                          "The blood work results are particularly interesting - run the full protocol through the secure portal " +
                          "for additional insights. Remember that all interactions must be documented according to protocol alpha-7.\n\n" +
                          "Dr. S",
                      },
                    },
                  };

                  return newFileSystem;
                });

                return [
                  {
                    type: "system",
                    content: "Login successful. Welcome, Alex.",
                  },
                  {
                    type: "system",
                    content: "NOTICE: Administrator access granted.",
                  },
                  {
                    type: "system",
                    content:
                      'Secure files unlocked. Use "ls -a" to view all directories.',
                  },
                  {
                    type: "system",
                    content: "New secure directory mounted: .megacorp_secure",
                  },
                ];
              } else if (password === "password123") {
                setLoggedIn(true);
                setAccessLevel("user");
                return [
                  {
                    type: "system",
                    content: "Login successful. Welcome, Alex.",
                  },
                  { type: "system", content: "Standard user access granted." },
                ];
              } else {
                setLoginAttempts((prev) => prev + 1);
                if (loginAttempts >= 2) {
                  return [
                    {
                      type: "error",
                      content: "Login failed. Too many attempts.",
                    },
                    {
                      type: "system",
                      content:
                        "Hint: The password related to blood is required for elevated access.",
                    },
                  ];
                }
                return [
                  {
                    type: "error",
                    content: "Login failed. Incorrect password.",
                  },
                ];
              }
            },
          },
        ];
      },
    },

    grep: {
      description: "Search for a pattern in a file",
      usage: "grep <pattern> <file>",
      execute: (args) => {
        if (args.length < 2) {
          return [
            {
              type: "error",
              content: "grep: missing arguments. Usage: grep <pattern> <file>",
            },
          ];
        }

        const pattern = args[0].toLowerCase();
        const path = resolvePath(args[1]);
        const fileObj = getPathObject(path);

        if (!fileObj) {
          return [
            {
              type: "error",
              content: `grep: ${args[1]}: No such file or directory`,
            },
          ];
        }

        if (fileObj.type === "directory") {
          return [
            { type: "error", content: `grep: ${args[1]}: Is a directory` },
          ];
        }

        const matches = fileObj.content
          .split("\n")
          .filter((line) => line.toLowerCase().includes(pattern))
          .map((line) => ({ type: "system", content: line }));

        return matches.length > 0
          ? matches
          : [
              {
                type: "system",
                content: `No matches found for '${pattern}' in ${args[1]}`,
              },
            ];
      },
    },

    logout: {
      description: "Logout from the current session",
      usage: "logout",
      execute: () => {
        if (!loggedIn) {
          return [
            { type: "error", content: "You are not currently logged in." },
          ];
        }

        setLoggedIn(false);
        setAccessLevel("user");

        return [
          { type: "system", content: "Logout successful." },
          {
            type: "system",
            content: "All privileged access has been revoked.",
          },
        ];
      },
    },
  };

  // Helper function to resolve a path (similar to Unix path resolution)
  const resolvePath = (path) => {
    // If path starts with /, it's an absolute path from root
    if (path === "~" || path === "/") return "~";

    // Remove trailing slash if present
    path = path.endsWith("/") ? path.slice(0, -1) : path;

    let currentPath = currentDirectory;

    // If path starts with ~, it's from the home directory
    if (path.startsWith("~/")) {
      currentPath = "~";
      path = path.substring(2);
    } else if (path.startsWith("/")) {
      currentPath = "~";
      path = path.substring(1);
    }

    // Handle '..' (parent directory) and '.' (current directory)
    const segments = path.split("/").filter((s) => s !== "");
    const currentSegments = currentPath.split("/").filter((s) => s !== "");

    for (const segment of segments) {
      if (segment === "..") {
        // Go up one directory
        if (
          currentSegments.length > 1 ||
          (currentSegments.length === 1 && currentSegments[0] !== "~")
        ) {
          currentSegments.pop();
        }
      } else if (segment === ".") {
        // Stay in current directory
        continue;
      } else {
        // Move to specified directory
        currentSegments.push(segment);
      }
    }

    return currentSegments.join("/");
  };

  // Helper function to get an object at a specific path
  const getPathObject = (path) => {
    const segments = path.split("/").filter((s) => s !== "");

    let current = fileSystem;
    if (segments[0] === "~" || segments.length === 0) {
      current = fileSystem["~"];
      segments.shift();
    } else {
      return null; // Invalid path
    }

    for (const segment of segments) {
      if (!current.content || !current.content[segment]) {
        return null; // Path doesn't exist
      }
      current = current.content[segment];
    }

    return current;
  };

  // Function to execute shell commands
  const executeCommand = (cmd) => {
    if (!cmd) return [];

    // Split the command and arguments, respecting quotes
    const parts = [];
    let current = "";
    let inQuotes = false;
    let escapeNext = false;

    for (let i = 0; i < cmd.length; i++) {
      const char = cmd[i];

      if (escapeNext) {
        current += char;
        escapeNext = false;
        continue;
      }

      if (char === "\\") {
        escapeNext = true;
        continue;
      }

      if (char === '"') {
        inQuotes = !inQuotes;
        continue;
      }

      if (char === " " && !inQuotes) {
        if (current) {
          parts.push(current);
          current = "";
        }
        continue;
      }

      current += char;
    }

    if (current) {
      parts.push(current);
    }

    if (parts.length === 0) {
      return [];
    }

    // Execute commands
    const commandName = parts[0];
    const args = parts.slice(1);

    // Check for pipe redirection
    const pipeIndex = args.indexOf("|");
    if (pipeIndex !== -1) {
      // This is a simplified pipe implementation
      return [
        {
          type: "error",
          content:
            "Pipe operator (|) is not fully implemented in this terminal.",
        },
      ];
    }

    // Handle executable scripts with ./
    if (commandName.startsWith("./")) {
      const scriptPath = resolvePath(commandName.substring(2));
      const scriptObj = getPathObject(scriptPath);

      if (!scriptObj) {
        return [
          {
            type: "error",
            content: `${commandName}: No such file or directory`,
          },
        ];
      }

      if (scriptObj.type !== "executable") {
        return [
          { type: "error", content: `${commandName}: Permission denied` },
        ];
      }

      // Execute the script with arguments
      return scriptObj.execute(args);
    }

    // Check if command exists
    if (commands[commandName]) {
      return commands[commandName].execute(args);
    } else {
      return [{ type: "error", content: `${commandName}: command not found` }];
    }
  };

  // Handle form submission (command execution)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentCommand.trim()) return;

    // Add command to history
    setCommandHistory((prev) => [...prev, currentCommand]);

    // Show the command in the terminal
    const newOutput = [
      ...terminalOutput,
      { type: "command", content: `${currentDirectory} $ ${currentCommand}` },
    ];

    // Process input if terminal is waiting for it
    const lastOutput = terminalOutput[terminalOutput.length - 1];
    if (lastOutput && lastOutput.waitForInput) {
      // Echo the password with asterisks if in password mode
      if (lastOutput.passwordMode) {
        newOutput.push({
          type: "echo",
          content: "*".repeat(currentCommand.length),
        });
      }

      // Call the callback function with the input
      const result = lastOutput.callback(currentCommand);
      setTerminalOutput([...newOutput, ...result]);
    } else {
      // Normal command execution
      const result = executeCommand(currentCommand);
      setTerminalOutput([...newOutput, ...result]);
    }

    setCurrentCommand("");
  };

  // Auto-focus the input field and scroll to bottom when output changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  // Keyboard history navigation
  const [historyIndex, setHistoryIndex] = useState(-1);

  const handleKeyDown = (e) => {
    // Handle up arrow for history navigation
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        setHistoryIndex((prev) => prev + 1);
        setCurrentCommand(
          commandHistory[commandHistory.length - 1 - historyIndex - 1],
        );
      }
    }

    // Handle down arrow for history navigation
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        setHistoryIndex((prev) => prev - 1);
        setCurrentCommand(
          commandHistory[commandHistory.length - 1 - historyIndex + 1],
        );
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand("");
      }
    }

    // Handle tab for command completion (basic implementation)
    if (e.key === "Tab") {
      e.preventDefault();

      // Get the current partial command
      const parts = currentCommand.split(" ");
      const lastPart = parts[parts.length - 1];

      // If first word, try to complete command
      if (parts.length === 1) {
        const matches = Object.keys(commands).filter((cmd) =>
          cmd.startsWith(lastPart),
        );
        if (matches.length === 1) {
          setCurrentCommand(matches[0]);
        }
      }
      // If second word or later, try to complete path
      else if (parts.length > 1) {
        // Simple directory completion
        const pwd = currentDirectory;
        const dirObj = getPathObject(pwd);

        if (dirObj && dirObj.type === "directory") {
          const matches = Object.keys(dirObj.content).filter((name) =>
            name.startsWith(lastPart),
          );
          if (matches.length === 1) {
            parts[parts.length - 1] = matches[0];
            setCurrentCommand(parts.join(" "));
          }
        }
      }
    }
  };

  return e(
    "div",
    {
      className:
        "flex flex-col h-full bg-black text-green-400 font-mono text-sm p-1 overflow-hidden",
    },
    [
      // Terminal output area
      e(
        "div",
        {
          ref: terminalRef,
          className: "flex-1 overflow-y-auto pb-2 px-1",
        },
        terminalOutput.map((line, index) => {
          return e(
            "div",
            {
              key: `line-${index}`,
              className: `${
                line.type === "error"
                  ? "text-red-400"
                  : line.type === "command"
                    ? "text-yellow-400"
                    : line.type === "input"
                      ? "text-purple-400"
                      : "text-green-400"
              }`,
            },
            line.content,
          );
        }),
      ),

      // Command input area
      e(
        "form",
        {
          onSubmit: handleSubmit,
          className: "flex items-center",
        },
        [
          // Only show prompt if not waiting for input
          !terminalOutput[terminalOutput.length - 1]?.waitForInput &&
            e("span", { className: "mr-2" }, `${currentDirectory} $`),

          // Show custom prompt if waiting for input
          terminalOutput[terminalOutput.length - 1]?.waitForInput &&
            e(
              "span",
              { className: "mr-2" },
              terminalOutput[terminalOutput.length - 1].content,
            ),

          e("div", { className: "flex-1 relative" }, [
            e("input", {
              ref: inputRef,
              type: terminalOutput[terminalOutput.length - 1]?.passwordMode
                ? "password"
                : "text",
              value: currentCommand,
              onChange: (e) => setCurrentCommand(e.target.value),
              onKeyDown: handleKeyDown,
              className:
                "w-full bg-transparent border-none outline-none text-green-400",
              autoFocus: true,
              spellCheck: false,
            }),

            // Blinking cursor (positioned at end of input)
            currentCommand.length === 0 &&
              e("span", {
                className: `absolute left-0 top-0 h-full w-2 ${showCursor ? "bg-green-400" : "bg-transparent"}`,
              }),
          ]),
        ],
      ),
    ],
  );
};

// Main TerminalWindow component using the WindowFrame
export const TerminalWindow = ({ onClose, onMinimize, isMinimized }) => {
  // Custom theme for terminal
  const terminalTheme = {
    titleBarBg: "bg-gray-900",
    closeButton: "bg-red-500 hover:bg-red-600",
    minimizeButton: "bg-yellow-500 hover:bg-yellow-600",
    maximizeButton: "bg-green-500 hover:bg-green-600",
    windowBorder: "border-gray-700",
  };

  return e(
    WindowFrame,
    {
      title: "Terminal",
      initialPosition: { x: 200, y: 100 },
      initialSize: { width: 700, height: 500 },
      minSize: { width: 400, height: 300 },
      onClose,
      onMinimize,
      isMinimized,
      theme: terminalTheme,
    },
    e(TerminalContent),
  );
};
