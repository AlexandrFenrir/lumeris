// Sound Effects Utility for Gaming Experience
// Uses Web Audio API to generate game-like sound effects

class SoundEffects {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== "undefined") {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = "sine",
    volume: number = 0.3
  ) {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Achievement unlocked sound
  achievementUnlocked() {
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;

    // Play ascending notes
    this.playTone(523.25, 0.1, "square", 0.2); // C5
    setTimeout(() => this.playTone(659.25, 0.1, "square", 0.2), 100); // E5
    setTimeout(() => this.playTone(783.99, 0.3, "square", 0.3), 200); // G5
  }

  // Trade executed sound
  tradeExecuted(isProfit: boolean) {
    if (isProfit) {
      // Success sound - ascending
      this.playTone(440, 0.1, "sine", 0.2);
      setTimeout(() => this.playTone(554.37, 0.15, "sine", 0.25), 80);
    } else {
      // Loss sound - descending
      this.playTone(440, 0.1, "sine", 0.2);
      setTimeout(() => this.playTone(349.23, 0.15, "sine", 0.25), 80);
    }
  }

  // Buy signal sound
  buySignal() {
    this.playTone(880, 0.15, "triangle", 0.2);
    setTimeout(() => this.playTone(1046.5, 0.1, "triangle", 0.15), 100);
  }

  // Sell signal sound
  sellSignal() {
    this.playTone(659.25, 0.15, "triangle", 0.2);
    setTimeout(() => this.playTone(523.25, 0.1, "triangle", 0.15), 100);
  }

  // Level up sound
  levelUp() {
    if (!this.audioContext) return;

    this.playTone(523.25, 0.1, "square", 0.2);
    setTimeout(() => this.playTone(659.25, 0.1, "square", 0.2), 100);
    setTimeout(() => this.playTone(783.99, 0.1, "square", 0.2), 200);
    setTimeout(() => this.playTone(1046.5, 0.3, "square", 0.3), 300);
  }

  // Coin collect sound
  coinCollect() {
    this.playTone(1046.5, 0.1, "sine", 0.2);
    setTimeout(() => this.playTone(1318.51, 0.1, "sine", 0.15), 50);
  }

  // Button click sound
  buttonClick() {
    this.playTone(800, 0.05, "square", 0.1);
  }

  // Notification sound
  notification() {
    this.playTone(880, 0.1, "sine", 0.15);
    setTimeout(() => this.playTone(1046.5, 0.1, "sine", 0.15), 100);
  }

  // Error sound
  error() {
    this.playTone(200, 0.2, "sawtooth", 0.2);
  }

  // Success sound
  success() {
    this.playTone(523.25, 0.1, "sine", 0.2);
    setTimeout(() => this.playTone(659.25, 0.1, "sine", 0.2), 100);
    setTimeout(() => this.playTone(783.99, 0.2, "sine", 0.25), 200);
  }

  // Streak milestone sound
  streakMilestone() {
    if (!this.audioContext) return;

    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.playTone(1046.5 + i * 100, 0.1, "triangle", 0.2);
      }, i * 80);
    }
  }

  // NFT reward sound
  nftReward() {
    if (!this.audioContext) return;

    // Magical sparkle sound
    this.playTone(1318.51, 0.1, "sine", 0.15);
    setTimeout(() => this.playTone(1567.98, 0.1, "sine", 0.15), 80);
    setTimeout(() => this.playTone(2093, 0.2, "sine", 0.2), 160);
  }
}

// Export singleton instance
export const soundEffects = new SoundEffects();

// Export utility functions
export const playSoundEffect = {
  achievementUnlocked: () => soundEffects.achievementUnlocked(),
  tradeExecuted: (isProfit: boolean) => soundEffects.tradeExecuted(isProfit),
  buySignal: () => soundEffects.buySignal(),
  sellSignal: () => soundEffects.sellSignal(),
  levelUp: () => soundEffects.levelUp(),
  coinCollect: () => soundEffects.coinCollect(),
  buttonClick: () => soundEffects.buttonClick(),
  notification: () => soundEffects.notification(),
  error: () => soundEffects.error(),
  success: () => soundEffects.success(),
  streakMilestone: () => soundEffects.streakMilestone(),
  nftReward: () => soundEffects.nftReward(),
};

export default soundEffects;
