import { useState, useEffect, useRef } from "react";

// 8 Gaming Themes
export type GameThemeType =
  | "retroArcade"
  | "modernGaming"
  | "sciFiSpace"
  | "fantasyRPG"
  | "racingSports"
  | "horrorSurvival"
  | "cyberpunkTech"
  | "casinoGambling";

// Logo styles per theme (5 per theme)
export type LogoStyleType =
  | "style1"
  | "style2"
  | "style3"
  | "style4"
  | "style5";

// Button styles per theme (8 per theme)
export type ButtonStyleType =
  | "button1"
  | "button2"
  | "button3"
  | "button4"
  | "button5"
  | "button6"
  | "button7"
  | "button8";

export type TransitionType = "fade" | "slide" | "dissolve" | "flip";

export interface MatrixState {
  currentTheme: GameThemeType;
  currentLogoStyle: LogoStyleType;
  currentButtonStyle: ButtonStyleType;
  progress: number; // 0-100 percentage through current theme
  isTransitioning: boolean;
  transitionType: TransitionType;
  transitionProgress: number; // 0-100 during transition
}

const THEME_DURATION = 20000; // 20 seconds per theme
const TRANSITION_DURATION = 1500; // 1.5 seconds transition

const THEMES: GameThemeType[] = [
  "retroArcade",
  "modernGaming",
  "sciFiSpace",
  "fantasyRPG",
  "racingSports",
  "horrorSurvival",
  "cyberpunkTech",
  "casinoGambling",
];

const LOGO_STYLES: LogoStyleType[] = [
  "style1",
  "style2",
  "style3",
  "style4",
  "style5",
];

const BUTTON_STYLES: ButtonStyleType[] = [
  "button1",
  "button2",
  "button3",
  "button4",
  "button5",
  "button6",
  "button7",
  "button8",
];

const TRANSITIONS: TransitionType[] = ["fade", "slide", "dissolve", "flip"];

/**
 * Custom hook to manage the 160-second gaming theme cycle
 * Each theme displays for 20s (8 themes total)
 * Within each theme: 5 logo styles and 8 button styles rotate
 */
export const useMatrixCycle = () => {
  const [state, setState] = useState<MatrixState>({
    currentTheme: "retroArcade",
    currentLogoStyle: "style1",
    currentButtonStyle: "button1",
    progress: 0,
    isTransitioning: false,
    transitionType: "fade",
    transitionProgress: 0,
  });

  const startTimeRef = useRef(Date.now());
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const updateCycle = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const totalCycleDuration = THEME_DURATION * THEMES.length;
      const cyclePosition = elapsed % totalCycleDuration;

      // Calculate current theme index (changes every 20 seconds)
      const themeIndex = Math.floor(cyclePosition / THEME_DURATION);
      const currentTheme = THEMES[themeIndex];

      // Calculate progress within current theme (0-100)
      const themeProgress = cyclePosition % THEME_DURATION;
      const progress = (themeProgress / THEME_DURATION) * 100;

      // Within each 20s theme, logos rotate every 4s (5 logos)
      const logoRotationDuration = THEME_DURATION / LOGO_STYLES.length; // 4 seconds
      const logoIndex = Math.floor(themeProgress / logoRotationDuration);
      const currentLogoStyle = LOGO_STYLES[logoIndex];

      // Within each 20s theme, buttons rotate every 2.5s (8 buttons)
      const buttonRotationDuration = THEME_DURATION / BUTTON_STYLES.length; // 2.5 seconds
      const buttonIndex = Math.floor(themeProgress / buttonRotationDuration);
      const currentButtonStyle = BUTTON_STYLES[buttonIndex];

      // Check if we're in transition phase (last 1.5 seconds of theme)
      const isTransitioning =
        themeProgress >= THEME_DURATION - TRANSITION_DURATION;

      // Calculate transition progress (0-100 during transition)
      const transitionProgress = isTransitioning
        ? ((themeProgress - (THEME_DURATION - TRANSITION_DURATION)) /
            TRANSITION_DURATION) *
          100
        : 0;

      // Determine which transition effect to use (cycles through all 4)
      const transitionIndex = themeIndex % TRANSITIONS.length;
      const transitionType = TRANSITIONS[transitionIndex];

      setState({
        currentTheme,
        currentLogoStyle,
        currentButtonStyle,
        progress,
        isTransitioning,
        transitionType,
        transitionProgress,
      });

      animationFrameRef.current = requestAnimationFrame(updateCycle);
    };

    animationFrameRef.current = requestAnimationFrame(updateCycle);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return state;
};

/**
 * Get the next theme in the sequence
 */
export const getNextTheme = (currentTheme: GameThemeType): GameThemeType => {
  const currentIndex = THEMES.indexOf(currentTheme);
  const nextIndex = (currentIndex + 1) % THEMES.length;
  return THEMES[nextIndex];
};

/**
 * Get theme configuration (colors, names, etc.)
 */
export const getThemeConfig = (theme: GameThemeType) => {
  const configs = {
    retroArcade: {
      name: "Retro Arcade",
      colors: { primary: "#ff00ff", secondary: "#00ffff", accent: "#ffff00" },
      bgColor: "#1a0033",
    },
    modernGaming: {
      name: "Modern Gaming",
      colors: { primary: "#00ff88", secondary: "#0088ff", accent: "#ff0088" },
      bgColor: "#0a0a0a",
    },
    sciFiSpace: {
      name: "Sci-Fi Space",
      colors: { primary: "#4444ff", secondary: "#8844ff", accent: "#ffffff" },
      bgColor: "#000011",
    },
    fantasyRPG: {
      name: "Fantasy RPG",
      colors: { primary: "#ff8800", secondary: "#8800ff", accent: "#ffdd00" },
      bgColor: "#1a0a00",
    },
    racingSports: {
      name: "Racing/Sports",
      colors: { primary: "#ff0000", secondary: "#ffffff", accent: "#000000" },
      bgColor: "#0a0a0a",
    },
    horrorSurvival: {
      name: "Horror/Survival",
      colors: { primary: "#880000", secondary: "#444444", accent: "#ff0000" },
      bgColor: "#0a0000",
    },
    cyberpunkTech: {
      name: "Cyberpunk Tech",
      colors: { primary: "#00ffff", secondary: "#ff00ff", accent: "#ffff00" },
      bgColor: "#0a0a1a",
    },
    casinoGambling: {
      name: "Casino/Gambling",
      colors: { primary: "#ffd700", secondary: "#ff0000", accent: "#000000" },
      bgColor: "#0a1a0a",
    },
  };
  return configs[theme];
};
