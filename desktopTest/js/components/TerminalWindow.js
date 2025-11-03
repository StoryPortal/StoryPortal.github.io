// js/components/TerminalWindow.js
const { useState, useRef, useEffect } = React;
const { createElement: e } = React;

import { WindowFrame } from "./WindowFrame.js";

// Terminal Content Component - Separated from window frame
const TerminalContent = ({ isMaximized, windowSize }) => {
  const [commandHistory, setCommandHistory] = useState([]);
  const [currentCommand, setCurrentCommand] = useState("");
  const [terminalOutput, setTerminalOutput] = useState([
    { type: "system", content: "Brain Bash Shell v3.9.2" },
    { type: "system", content: "" },
    { type: "system", content: 'Type "help" for available commands.' },
    { type: "system", content: "Note: Terminal is case-sensitive" },
  ]);
  const [accessLevel, setAccessLevel] = useState("user");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [currentDirectory, setCurrentDirectory] = useState("~");
  const [showCursor, setShowCursor] = useState(true);

  // MegaCorp server connection state
  const [megacorpConnected, setMegacorpConnected] = useState(false);
  const [megacorpAccessLevel, setMegacorpAccessLevel] = useState(null);

  // Audio player state
  const [audioPlayer, setAudioPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentRecording, setCurrentRecording] = useState(null);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [visualizerFrame, setVisualizerFrame] = useState(0);
  const audioRef = useRef(null);
  const playbackIntervalRef = useRef(null);
  const visualizerIntervalRef = useRef(null);
  const liveUpdateIntervalRef = useRef(null);
  const liveVisualizationStartIndex = useRef(null);

  // Helper functions for audio visualization
  const generateWaveform = (frame, recordingId = 1) => {
    // Different pattern sets for different recordings
    const patternSets = {
      1: [
        // slot_machine_short - more erratic, sharp patterns
        "▂▃▅█▇▅▂▁▃",
        "▃▅█▇▃▁▂▅▇",
        "▅█▇▂▁▃▇█▅",
        "█▇▃▁▂▅█▇▃",
        "▇▂▁▃▇█▅▂▁",
        "▃▁▂▅█▇▃▁▂",
        "▁▃▇█▅▂▁▃▅",
        "▂▅▇█▃▁▂▅█",
      ],
      2: [
        // there_and_back_again - smoother, wave-like patterns
        "▁▂▃▅▇█▇▅▃",
        "▂▃▅▇█▇▅▃▂",
        "▃▅▇█▇▅▃▂▁",
        "▅▇█▇▅▃▂▁▂",
        "▇█▇▅▃▂▁▂▃",
        "█▇▅▃▂▁▂▃▅",
        "▇▅▃▂▁▂▃▅▇",
        "▅▃▂▁▂▃▅▇█",
      ],
    };

    const patterns = patternSets[recordingId] || patternSets[1];
    const patternIndex = frame % patterns.length;
    return patterns[patternIndex].repeat(4);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const generateProgressBar = (current, total, width = 30) => {
    const progress = Math.min(current / total, 1);
    const filled = Math.floor(progress * width);
    const empty = width - filled;
    return `[${"█".repeat(filled)}${"░".repeat(empty)}]`;
  };

  const getNeuralAnalysis = (time, duration) => {
    // Generate different messages based on playback time
    const progress = time / duration;

    if (progress < 0.2) {
      return {
        theta: "ELEVATED",
        delta: "NORMAL",
        heartRate: "138 BPM",
      };
    } else if (progress < 0.4) {
      return {
        theta: "CRITICAL",
        delta: "ABNORMAL",
        heartRate: "142 BPM",
      };
    } else if (progress < 0.6) {
      return {
        theta: "CRITICAL",
        delta: "ABNORMAL",
        heartRate: "145 BPM",
      };
    } else if (progress < 0.8) {
      return {
        theta: "DANGEROUS",
        delta: "CRITICAL",
        heartRate: "148 BPM",
      };
    } else {
      return {
        theta: "EXTREME",
        delta: "CRITICAL",
        heartRate: "151 BPM",
      };
    }
  };

  // Effect to update playback visualization
  useEffect(() => {
    if (isPlaying && !isPaused && audioRef.current) {
      // Update playback time
      playbackIntervalRef.current = setInterval(() => {
        if (audioRef.current) {
          setPlaybackTime(audioRef.current.currentTime);
        }
      }, 100);

      // Update visualizer animation
      visualizerIntervalRef.current = setInterval(() => {
        setVisualizerFrame((prev) => prev + 1);
      }, 150);

      return () => {
        if (playbackIntervalRef.current) {
          clearInterval(playbackIntervalRef.current);
        }
        if (visualizerIntervalRef.current) {
          clearInterval(visualizerIntervalRef.current);
        }
      };
    }
  }, [isPlaying, isPaused]);

  // Effect to update terminal output with live visualization
  useEffect(() => {
    if (isPlaying && !isPaused && audioRef.current && currentRecording) {
      // Update terminal output every 500ms for smoother animation
      liveUpdateIntervalRef.current = setInterval(() => {
        if (audioRef.current && currentRecording) {
          const duration = audioRef.current.duration || 0;
          const currentTime = audioRef.current.currentTime || 0;

          // Use the recording ID and faster frame updates for waveform
          const frame = Math.floor(Date.now() / 100) % 8; // Update frame every 100ms
          const waveform = generateWaveform(frame, currentRecording.id);
          const progressBar = generateProgressBar(currentTime, duration);
          const analysis = getNeuralAnalysis(currentTime, duration);

          const newVisualization = [
            { type: "system", content: "" },
            { type: "system", content: `${waveform}` },
            {
              type: "system",
              content: `${progressBar} ${formatTime(currentTime)} / ${formatTime(duration)}`,
            },
            { type: "system", content: "" },
            { type: "system", content: "Neural Pattern Analysis:" },
            { type: "system", content: `- Theta waves: ${analysis.theta}` },
            { type: "system", content: `- Delta patterns: ${analysis.delta}` },
            {
              type: "system",
              content: `- Cardiac sync: ${analysis.heartRate}`,
            },
            { type: "system", content: "" },
          ];

          setTerminalOutput((prev) => {
            // If there's a previous visualization, remove it
            if (liveVisualizationStartIndex.current !== null) {
              const beforeVisualization = prev.slice(
                0,
                liveVisualizationStartIndex.current,
              );
              liveVisualizationStartIndex.current = beforeVisualization.length;
              return [...beforeVisualization, ...newVisualization];
            } else {
              // First visualization - record where it starts
              liveVisualizationStartIndex.current = prev.length;
              return [...prev, ...newVisualization];
            }
          });
        }
      }, 500); // Update every 500ms for smooth animation

      return () => {
        if (liveUpdateIntervalRef.current) {
          clearInterval(liveUpdateIntervalRef.current);
        }
      };
    } else {
      // Clear interval when not playing
      if (liveUpdateIntervalRef.current) {
        clearInterval(liveUpdateIntervalRef.current);
        liveUpdateIntervalRef.current = null;
      }
      // Reset the visualization start index
      liveVisualizationStartIndex.current = null;
    }
  }, [isPlaying, isPaused, currentRecording]);

  // File system structure
  const [fileSystem, setFileSystem] = useState({
    "~": {
      type: "directory",
      content: {
        documents: {
          type: "directory",
          content: {
            ProductXInfo: {
              type: "directory",
              content: {
                "welcome_email.txt": {
                  type: "file",
                  content:
                    "From: MegaCorp Product Testing Division <testing@megacorp.com>\nTo: Alex Pell <alex.pell@email.com>\nSubject: Welcome to Product X Beta Testing Program\n\n---\n\nDear Test Subject #47,\n\nWelcome to the MegaCorp Product X Beta Testing Program!\n\nYour participation is invaluable to us. To access your personalized testing dashboard and documentation, we've included a secure portal connection tool.\n\nAttached: portal_connect.sh\n\nTo connect to the Subject Portal:\n1. Run: ./portal_connect.sh\n2. Login with your credentials:\n   Username: subject47\n   Password: productx2024\n\nOnce connected, you can browse the server filesystem for:\n- Testing schedules and guidelines (/subject/docs/)\n- FAQ and support resources\n- Program information\n\nThank you for your participation!\n\nBest regards,\nMegaCorp Testing Coordination Team",
                },
                "portal_connect.sh": {
                  type: "executable",
                  content:
                    "#!/bin/bash\n# MegaCorp Product X Portal Connection Tool\n# Securely connects to MegaCorp testing portals\n# Supports multiple authentication levels (subject, employee, admin)",
                  execute: (args) => {
                    if (megacorpConnected) {
                      return [
                        {
                          type: "error",
                          content: "Already connected to MegaCorp Portal.",
                        },
                        {
                          type: "system",
                          content: `Access level: ${megacorpAccessLevel}`,
                        },
                        {
                          type: "system",
                          content: 'Run "./portal_disconnect.sh" to logout.',
                        },
                      ];
                    }

                    return [
                      {
                        type: "system",
                        content: "Connecting to MegaCorp Portal Server...",
                      },
                      { type: "system", content: "portal.megacorp.com:8443" },
                      { type: "system", content: "" },
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
                                // Subject Portal Login
                                if (
                                  username === "subject47" &&
                                  password === "productx2024"
                                ) {
                                  setMegacorpConnected(true);
                                  setMegacorpAccessLevel("subject");
                                  setCurrentDirectory("~/subject");

                                  // Mount subject filesystem
                                  setFileSystem((prevFileSystem) => {
                                    const newFileSystem = JSON.parse(
                                      JSON.stringify(prevFileSystem),
                                    );
                                    newFileSystem["~"].content.subject = {
                                      type: "directory",
                                      content: {
                                        home: {
                                          type: "directory",
                                          content: {
                                            "README.txt": {
                                              type: "file",
                                              content:
                                                "PRODUCT X SUBJECT PORTAL\n" +
                                                "========================\n\n" +
                                                "Welcome to your secure testing portal, Subject #47.\n\n" +
                                                "Available resources:\n" +
                                                "  /subject/docs/    - Testing documentation\n" +
                                                "  /subject/support/ - Support and FAQ\n\n" +
                                                "For assistance, contact your testing coordinator.\n",
                                            },
                                          },
                                        },
                                        docs: {
                                          type: "directory",
                                          content: {
                                            "testing_agreement.pdf": {
                                              type: "file",
                                              content:
                                                "[Binary PDF file - Use 'cat' to view summary]\n\n" +
                                                "MEGACORP PRODUCT X TESTING AGREEMENT\n" +
                                                "=====================================\n\n" +
                                                "Subject: Alex Pell (Subject #47)\n" +
                                                "Program Duration: 12 weeks (4 phases)\n" +
                                                "Compensation: $2,400 upon completion\n\n" +
                                                "TERMS AND CONDITIONS:\n\n" +
                                                "1. PARTICIPATION REQUIREMENTS\n" +
                                                "   - Daily device usage as directed\n" +
                                                "   - Weekly health check-ins\n" +
                                                "   - Prompt reporting of any adverse effects\n\n" +
                                                "2. COMPENSATION\n" +
                                                "   - Full payment upon completion of all 4 phases\n" +
                                                "   - Early termination: No compensation\n\n" +
                                                "3. CONFIDENTIALITY\n" +
                                                "   - Product X technology is proprietary\n" +
                                                "   - Subject agrees to maintain confidentiality\n" +
                                                "   - Non-disclosure agreement in effect for 5 years\n\n" +
                                                "4. HEALTH AND SAFETY\n" +
                                                "   - MegaCorp provides medical monitoring\n" +
                                                "   - Emergency contact: 1-800-MEGACORP\n" +
                                                "   - Subject may withdraw at any time\n\n" +
                                                "5. LIABILITY\n" +
                                                "   - Subject acknowledges experimental nature of Product X\n" +
                                                "   - MegaCorp maintains appropriate insurance coverage\n" +
                                                "   - Subject's medical records used for research purposes\n\n" +
                                                "By signing, you agree to the above terms.\n\n" +
                                                "Signed: Alex Pell\n" +
                                                "Date: [Testing Start Date]\n\n" +
                                                "MegaCorp Representative: Dr. Sanguis\n" +
                                                "Testing Coordinator ID: MC-47839\n",
                                            },
                                            "testing_guide.txt": {
                                              type: "file",
                                              content:
                                                "PRODUCT X TESTING GUIDE\n" +
                                                "=======================\n\n" +
                                                "Phase 1-4 Overview:\n" +
                                                "- Daily device usage logs required\n" +
                                                "- Weekly health check-ins\n" +
                                                "- Report any side effects immediately\n\n" +
                                                "Common experiences:\n" +
                                                "- Mild tingling (normal)\n" +
                                                "- Temporary headaches (normal)\n" +
                                                "- Vivid dreams (normal)\n",
                                            },
                                            "safety_guidelines.pdf": {
                                              type: "file",
                                              content:
                                                "[Binary PDF file - Use 'cat' to view summary]\n\n" +
                                                "PRODUCT X SAFETY GUIDELINES\n" +
                                                "============================\n\n" +
                                                "MegaCorp is committed to your safety during testing.\n\n" +
                                                "EXPECTED SIDE EFFECTS:\n" +
                                                "- Mild peripheral tingling (temporary)\n" +
                                                "- Light headaches (typically subsides)\n" +
                                                "- Enhanced dream activity (harmless)\n\n" +
                                                "WHEN TO CONTACT YOUR COORDINATOR:\n" +
                                                "- Persistent severe headaches\n" +
                                                "- Vision changes\n" +
                                                "- Difficulty breathing\n\n" +
                                                "NOTE: Minor chest discomfort is typically stress-related.\n" +
                                                "If symptoms persist, mention during weekly check-in.\n\n" +
                                                "Emergency Contact: 1-800-MEGACORP\n",
                                            },
                                            "faq.txt": {
                                              type: "file",
                                              content:
                                                "FREQUENTLY ASKED QUESTIONS\n" +
                                                "==========================\n\n" +
                                                "Q: Are the tingling sensations dangerous?\n" +
                                                "A: No, this is a normal response to the neural interface.\n\n" +
                                                "Q: What if I experience chest pain?\n" +
                                                "A: This is typically psychosomatic. Continue testing and monitor.\n\n" +
                                                "Q: Can I stop testing early?\n" +
                                                "A: Please complete all 4 phases for full compensation.\n",
                                            },
                                          },
                                        },
                                      },
                                    };
                                    return newFileSystem;
                                  });

                                  return [
                                    { type: "system", content: "" },
                                    {
                                      type: "system",
                                      content: "Authentication successful!",
                                    },
                                    {
                                      type: "system",
                                      content: "Subject Portal Access Granted",
                                    },
                                    { type: "system", content: "" },
                                    {
                                      type: "system",
                                      content: "Subject ID: #47 (Alex Pell)",
                                    },
                                    {
                                      type: "system",
                                      content:
                                        "Testing Status: ACTIVE - Phase 2/4",
                                    },
                                    { type: "system", content: "" },
                                    {
                                      type: "system",
                                      content:
                                        "Server filesystem mounted at ~/subject/",
                                    },
                                    {
                                      type: "system",
                                      content:
                                        'Type "ls" to view available resources',
                                    },
                                  ];
                                }
                                // Employee Portal Login
                                else if (password === "s4ngu1s") {
                                  setMegacorpConnected(true);
                                  setMegacorpAccessLevel("employee");
                                  setCurrentDirectory("~/megacorp");

                                  // Mount employee filesystem
                                  setFileSystem((prevFileSystem) => {
                                    const newFileSystem = JSON.parse(
                                      JSON.stringify(prevFileSystem),
                                    );
                                    newFileSystem["~"].content.megacorp = {
                                      type: "directory",
                                      content: {
                                        internal: {
                                          type: "directory",
                                          content: {
                                            "contract_subject47.pdf": {
                                              type: "file",
                                              content:
                                                "[Binary PDF file - Use 'cat' to view summary]\n\n" +
                                                "MEGACORP PRODUCT X TESTING AGREEMENT\n" +
                                                "Subject: Alex Pell (Subject #47)\n" +
                                                "Compensation: $2,400 for 12-week program\n\n" +
                                                "CONFIDENTIALITY CLAUSE:\n" +
                                                "Subject agrees not to disclose any adverse effects to third parties.\n\n" +
                                                "LIABILITY WAIVER:\n" +
                                                "Subject acknowledges that Product X is experimental technology.\n" +
                                                "MegaCorp is not liable for any health consequences.\n\n" +
                                                "TERMINATION:\n" +
                                                "Early termination forfeits all compensation.\n" +
                                                "Subject medical records become property of MegaCorp.\n",
                                            },
                                            "subject_047_file.txt": {
                                              type: "file",
                                              content:
                                                "SUBJECT #47 - ALEX PELL\n" +
                                                "========================\n\n" +
                                                "Status: ACTIVE TESTING\n" +
                                                "Device Usage: 246 hours\n" +
                                                "Compensation: $2,400 (Standard Rate)\n\n" +
                                                "REPORTED ADVERSE EFFECTS:\n" +
                                                "- Peripheral neuropathy (tingling) - EXPECTED\n" +
                                                "- Tension headaches - EXPECTED\n" +
                                                "- Cardiac arrhythmia indicators - MONITOR\n" +
                                                "- Sleep pattern disruption - EXPECTED\n\n" +
                                                "MEDICAL NOTES:\n" +
                                                "Subject reports chest pain. EKG scheduled but not urgent.\n" +
                                                "Symptoms consistent with anxiety response to device.\n" +
                                                "Assessment: Psychosomatic reaction, no device correlation.\n\n" +
                                                "PROTOCOL NOTES:\n" +
                                                "- Do NOT acknowledge potential cardiac effects to subject\n" +
                                                "- Reassure that symptoms are 'normal and temporary'\n" +
                                                "- Continue testing through Phase 4 unless critical event\n",
                                            },
                                          },
                                        },
                                        research: {
                                          type: "directory",
                                          content: {
                                            "memo_sanguis.txt": {
                                              type: "file",
                                              content:
                                                "FROM: Dr. Sanguis, Lead Researcher\n" +
                                                "TO: Product X Development Team\n" +
                                                "DATE: Current Testing Cycle\n" +
                                                "SUBJECT: Subject #47 Blood Analysis\n\n" +
                                                "Team,\n\n" +
                                                "Latest blood work on Subject #47 (Pell) shows concerning patterns:\n\n" +
                                                "- Protein Marker X-7: ELEVATED 450% above baseline\n" +
                                                "- Neural pathway inflammation indicators present\n" +
                                                "- Cardiac enzyme markers suggest mild stress response\n\n" +
                                                "This confirms the device IS having measurable biological effects.\n" +
                                                "However, we maintain our official position that symptoms are\n" +
                                                "psychosomatic in nature.\n\n" +
                                                "Subject must complete Phase 4 for complete data set.\n" +
                                                "Do not acknowledge device correlation in any subject communications.\n\n" +
                                                "Continue monitoring. Report any critical events immediately.\n\n" +
                                                "Dr. S\n",
                                            },
                                            "blood_analysis_047.pdf": {
                                              type: "file",
                                              content:
                                                "[Binary PDF file - Use 'cat' to view summary]\n\n" +
                                                "CONFIDENTIAL MEDICAL REPORT\n" +
                                                "Subject #47 Blood Panel Analysis\n" +
                                                "====================================\n\n" +
                                                "Patient: Alex Pell (Subject #47)\n" +
                                                "Test Date: Week 8 of Testing\n" +
                                                "Ordered By: Dr. Sanguis\n\n" +
                                                "ABNORMAL FINDINGS:\n\n" +
                                                "Protein Marker X-7:\n" +
                                                "  Baseline: 12.3 ng/mL\n" +
                                                "  Current:  55.4 ng/mL (450% increase)\n" +
                                                "  Status:   CRITICAL - Outside normal range\n\n" +
                                                "C-Reactive Protein (Inflammation):\n" +
                                                "  Result:   8.2 mg/L (ELEVATED)\n" +
                                                "  Normal:   <3.0 mg/L\n\n" +
                                                "Cardiac Troponin I:\n" +
                                                "  Result:   0.08 ng/mL (BORDERLINE)\n" +
                                                "  Normal:   <0.04 ng/mL\n" +
                                                "  Note:     Suggests mild cardiac stress\n\n" +
                                                "Neural Pathway Markers:\n" +
                                                "  NFP (Neurofilament Protein): ELEVATED\n" +
                                                "  Indicates active neural pathway inflammation\n\n" +
                                                "ASSESSMENT:\n" +
                                                "Blood chemistry clearly demonstrates Product X is causing\n" +
                                                "measurable biological changes. Continue standard protocol:\n" +
                                                "classify as 'psychosomatic' in subject communications.\n\n" +
                                                "Recommend: Continue testing. Monitor for critical events.\n",
                                            },
                                            "phase4_data.pdf": {
                                              type: "file",
                                              content:
                                                "[Binary PDF file - Use 'cat' to view summary]\n\n" +
                                                "PRODUCT X - PHASE 4 PROJECTED DATA\n" +
                                                "===================================\n\n" +
                                                "CONFIDENTIAL RESEARCH PROJECTION\n\n" +
                                                "Based on current subject responses in Phase 2-3,\n" +
                                                "Phase 4 testing is projected to yield:\n\n" +
                                                "EXPECTED OUTCOMES:\n" +
                                                "- 85% of subjects: Permanent neural adaptation\n" +
                                                "- 12% of subjects: Reversible side effects\n" +
                                                "- 3% of subjects: Severe adverse reactions\n\n" +
                                                "SUBJECT #47 TRAJECTORY:\n" +
                                                "Current biomarker trends suggest Subject #47 falls\n" +
                                                "into the 12% category. Symptoms should stabilize\n" +
                                                "post-testing, though cardiac markers may remain\n" +
                                                "elevated for 6-12 months.\n\n" +
                                                "RISK ASSESSMENT: MODERATE\n" +
                                                "Recommendation: CONTINUE TESTING\n\n" +
                                                "Note: Data essential for FDA approval package.\n" +
                                                "Subject must complete all 4 phases.\n",
                                            },
                                            "brainRecordings.exe": {
                                              type: "executable",
                                              content:
                                                "#!/usr/bin/env node\n" +
                                                "// MegaCorp Neural Interface Recorder v2.3.1\n" +
                                                "// Playback utility for captured neural data\n" +
                                                "// CLASSIFIED - EMPLOYEE ACCESS ONLY",
                                              execute: (args) => {
                                                // Available recordings
                                                const recordings = [
                                                  {
                                                    id: 1,
                                                    filename:
                                                      "2024-01-08_slot_machine_short.wav",
                                                    duration: "3:47",
                                                    date: "2024-01-08",
                                                    notes:
                                                      "High stress markers, elevated theta waves",
                                                    audioPath:
                                                      "./neural_recordings/slot_machine_short.wav",
                                                  },
                                                  {
                                                    id: 2,
                                                    filename:
                                                      "2024-01-05_there_and_back_again.wav",
                                                    duration: "4:12",
                                                    date: "2024-01-05",
                                                    notes:
                                                      "Subvocalization detected during session",
                                                    audioPath:
                                                      "./neural_recordings/there_and_back_again.wav",
                                                  },
                                                ];

                                                if (args.length === 0) {
                                                  // List available recordings
                                                  return [
                                                    {
                                                      type: "system",
                                                      content: "",
                                                    },
                                                    {
                                                      type: "system",
                                                      content:
                                                        "MEGACORP NEURAL INTERFACE RECORDER v2.3.1",
                                                    },
                                                    {
                                                      type: "system",
                                                      content:
                                                        "=========================================",
                                                    },
                                                    {
                                                      type: "system",
                                                      content: "",
                                                    },
                                                    {
                                                      type: "system",
                                                      content:
                                                        "Available neural recordings for Subject #47:",
                                                    },
                                                    {
                                                      type: "system",
                                                      content: "",
                                                    },
                                                    ...recordings.map(
                                                      (rec) => ({
                                                        type: "system",
                                                        content: `[${rec.id}] ${rec.filename} (${rec.duration}) - ${rec.notes}`,
                                                      }),
                                                    ),
                                                    {
                                                      type: "system",
                                                      content: "",
                                                    },
                                                    {
                                                      type: "system",
                                                      content:
                                                        "Usage: ./brainRecordings.exe [recording_id]",
                                                    },
                                                    {
                                                      type: "system",
                                                      content:
                                                        "Example: ./brainRecordings.exe 1",
                                                    },
                                                    {
                                                      type: "system",
                                                      content: "",
                                                    },
                                                    {
                                                      type: "error",
                                                      content:
                                                        "WARNING: Audio contains biometric data. CLASSIFIED.",
                                                    },
                                                  ];
                                                }

                                                // Play specific recording
                                                const recId = parseInt(args[0]);
                                                const recording =
                                                  recordings.find(
                                                    (r) => r.id === recId,
                                                  );

                                                if (!recording) {
                                                  return [
                                                    {
                                                      type: "error",
                                                      content: `Error: Recording ID ${args[0]} not found.`,
                                                    },
                                                    {
                                                      type: "system",
                                                      content:
                                                        "Use './brainRecordings.exe' to list available recordings.",
                                                    },
                                                  ];
                                                }

                                                // Create audio element if it doesn't exist
                                                if (!audioRef.current) {
                                                  audioRef.current =
                                                    new Audio();
                                                  audioRef.current.onended =
                                                    () => {
                                                      setIsPlaying(false);
                                                      setCurrentRecording(null);
                                                    };
                                                }

                                                // Stop current playback if any
                                                if (isPlaying) {
                                                  audioRef.current.pause();
                                                  audioRef.current.currentTime = 0;
                                                }

                                                // Load and play new recording
                                                audioRef.current.src =
                                                  recording.audioPath;
                                                audioRef.current
                                                  .play()
                                                  .catch((err) => {
                                                    console.error(
                                                      "Audio playback error:",
                                                      err,
                                                    );
                                                  });

                                                // Trigger the ending - set flag that recording was played
                                                localStorage.setItem(
                                                  "megacorp_recording_played",
                                                  "true",
                                                );

                                                setIsPlaying(true);
                                                setIsPaused(false);
                                                setCurrentRecording(recording);
                                                setPlaybackTime(0);
                                                setVisualizerFrame(0);

                                                return [
                                                  {
                                                    type: "system",
                                                    content: "",
                                                  },
                                                  {
                                                    type: "system",
                                                    content:
                                                      "MEGACORP NEURAL INTERFACE RECORDER v2.3.1",
                                                  },
                                                  {
                                                    type: "system",
                                                    content:
                                                      "Loading neural capture data...",
                                                  },
                                                  {
                                                    type: "system",
                                                    content: "",
                                                  },
                                                  {
                                                    type: "system",
                                                    content: `♪ Now Playing: ${recording.filename}`,
                                                  },
                                                  {
                                                    type: "system",
                                                    content: `Date: ${recording.date}`,
                                                  },
                                                  {
                                                    type: "system",
                                                    content: `Duration: ${recording.duration}`,
                                                  },
                                                  {
                                                    type: "system",
                                                    content: `Status: CLASSIFIED - EMPLOYEE ACCESS ONLY`,
                                                  },
                                                  {
                                                    type: "system",
                                                    content: "",
                                                  },
                                                  {
                                                    type: "system",
                                                    content:
                                                      "[PLAYING] " +
                                                      generateWaveform(0),
                                                  },
                                                  {
                                                    type: "system",
                                                    content: "",
                                                  },
                                                  {
                                                    type: "system",
                                                    content:
                                                      "Initializing neural pattern analysis...",
                                                  },
                                                  {
                                                    type: "system",
                                                    content: "",
                                                  },
                                                  {
                                                    type: "error",
                                                    content:
                                                      "WARNING: Audio contains biometric data. CLASSIFIED.",
                                                  },
                                                  {
                                                    type: "system",
                                                    content: "",
                                                  },
                                                  {
                                                    type: "system",
                                                    content:
                                                      "Commands: 'status' (live visualization) | 'pause' | 'resume' | 'stop'",
                                                  },
                                                ];
                                              },
                                            },
                                          },
                                        },
                                      },
                                    };
                                    return newFileSystem;
                                  });

                                  return [
                                    { type: "system", content: "" },
                                    {
                                      type: "system",
                                      content: "Authentication successful.",
                                    },
                                    {
                                      type: "system",
                                      content: "Employee Portal Access Granted",
                                    },
                                    { type: "system", content: "" },
                                    {
                                      type: "system",
                                      content: `Welcome, ${username}`,
                                    },
                                    {
                                      type: "system",
                                      content:
                                        "Access Level: INTERNAL EMPLOYEE",
                                    },
                                    { type: "system", content: "" },
                                    {
                                      type: "error",
                                      content:
                                        "ALERT: Unauthorized access detected and logged.",
                                    },
                                    {
                                      type: "error",
                                      content:
                                        "Security notification sent to monitoring team.",
                                    },
                                    { type: "system", content: "" },
                                    {
                                      type: "system",
                                      content:
                                        "Server filesystem mounted at ~/megacorp/",
                                    },
                                    {
                                      type: "system",
                                      content:
                                        'Type "ls" to view available directories',
                                    },
                                  ];
                                }
                                // Failed login
                                else {
                                  return [
                                    { type: "system", content: "" },
                                    {
                                      type: "error",
                                      content:
                                        "Authentication failed. Invalid credentials.",
                                    },
                                    {
                                      type: "system",
                                      content: "Connection closed.",
                                    },
                                  ];
                                }
                              },
                            },
                          ];
                        },
                      },
                    ];
                  },
                },
                "portal_disconnect.sh": {
                  type: "executable",
                  content: "#!/bin/bash\n# Disconnect from MegaCorp Portal",
                  execute: (args) => {
                    if (!megacorpConnected) {
                      return [
                        {
                          type: "error",
                          content: "Not connected to any portal.",
                        },
                      ];
                    }
                    const accessLevel = megacorpAccessLevel;
                    setMegacorpConnected(false);
                    setMegacorpAccessLevel(null);
                    return [
                      {
                        type: "system",
                        content: "Disconnecting from MegaCorp Portal...",
                      },
                      {
                        type: "system",
                        content: `Logged out from ${accessLevel}.`,
                      },
                      { type: "system", content: "Connection closed." },
                    ];
                  },
                },
              },
            },
            personal: {
              type: "directory",
              content: {
                "notes.txt": {
                  type: "file",
                  content:
                    "Remember to review the Product X documentation again.\nLook for any references to side effects or health warnings.\n\nThat strange email from MegaCorp support... I wrote about it in my Notes app.\nShould I try using that employee password they accidentally sent me?\n\nWhat are they hiding?",
                },
                "symptoms.txt": {
                  type: "file",
                  content:
                    "Day 12: Tingling in fingers persists.\nDay 15: Headaches are getting worse after extended use.\nDay 23: Strange dreams. Chest pain?\nDay 28: Should I be worried? The welcome email says to check the portal for info.",
                },
              },
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

    stop: {
      description: "Stop audio playback",
      usage: "stop",
      execute: () => {
        if (!isPlaying || !audioRef.current) {
          return [{ type: "error", content: "No audio is currently playing." }];
        }

        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
        setIsPaused(false);
        setPlaybackTime(0);

        const recordingName = currentRecording
          ? currentRecording.filename
          : "recording";
        setCurrentRecording(null);

        // Clear intervals
        if (playbackIntervalRef.current) {
          clearInterval(playbackIntervalRef.current);
        }
        if (visualizerIntervalRef.current) {
          clearInterval(visualizerIntervalRef.current);
        }
        if (liveUpdateIntervalRef.current) {
          clearInterval(liveUpdateIntervalRef.current);
        }

        return [
          { type: "system", content: "" },
          { type: "system", content: "Playback stopped." },
          { type: "system", content: `Closed: ${recordingName}` },
          { type: "system", content: "" },
        ];
      },
    },

    pause: {
      description: "Pause audio playback",
      usage: "pause",
      execute: () => {
        if (!isPlaying || !audioRef.current) {
          return [{ type: "error", content: "No audio is currently playing." }];
        }

        if (isPaused) {
          return [{ type: "error", content: "Playback is already paused." }];
        }

        audioRef.current.pause();
        setIsPaused(true);

        return [
          { type: "system", content: "Playback paused." },
          { type: "system", content: "Type 'resume' to continue." },
        ];
      },
    },

    resume: {
      description: "Resume audio playback",
      usage: "resume",
      execute: () => {
        if (!isPlaying || !audioRef.current) {
          return [{ type: "error", content: "No audio is currently loaded." }];
        }

        if (!isPaused) {
          return [{ type: "error", content: "Playback is not paused." }];
        }

        audioRef.current.play().catch((err) => {
          console.error("Resume error:", err);
        });
        setIsPaused(false);

        return [{ type: "system", content: "Playback resumed." }];
      },
    },

    status: {
      description: "Show current playback status",
      usage: "status",
      execute: () => {
        if (!isPlaying || !currentRecording || !audioRef.current) {
          return [
            { type: "error", content: "No recording is currently playing." },
          ];
        }

        const duration = audioRef.current.duration || 0;
        const currentTime = playbackTime;
        const waveform = generateWaveform(visualizerFrame);
        const progressBar = generateProgressBar(currentTime, duration);
        const analysis = getNeuralAnalysis(currentTime, duration);

        return [
          { type: "system", content: "" },
          {
            type: "system",
            content: `♪ Now Playing: ${currentRecording.filename}`,
          },
          { type: "system", content: "" },
          { type: "system", content: `${waveform}` },
          { type: "system", content: "" },
          {
            type: "system",
            content: `${progressBar} ${formatTime(currentTime)} / ${formatTime(duration)}`,
          },
          { type: "system", content: "" },
          { type: "system", content: "Neural Pattern Analysis:" },
          { type: "system", content: `- Theta waves: ${analysis.theta}` },
          { type: "system", content: `- Delta patterns: ${analysis.delta}` },
          { type: "system", content: `- Cardiac sync: ${analysis.heartRate}` },
          { type: "system", content: "" },
          { type: "system", content: isPaused ? "[PAUSED]" : "[PLAYING]" },
          { type: "system", content: "" },
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

    // Normalize currentPath: if it starts with / but not ~, prepend ~
    if (currentPath.startsWith("/") && !currentPath.startsWith("~/")) {
      currentPath = "~" + currentPath;
    }

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
