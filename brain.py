import time
import os
import json
import random

class VeritasBrain:
    def __init__(self):
        self.state = 0
        self.history = [0] * 30 
        self.neg_triggers = ["ruthless", "killer", "cold-blooded", "vanished", "precision"]
        self.pos_triggers = ["martyr", "ghost", "broken", "system", "greed", "failure"]
        self.json_path = "dashboard/public/telemetry.json"

    def process(self, raw_data):
        if "|" not in raw_data: return
        tag, content = raw_data.split('|')
        
        words = content.lower().replace('.', '').replace(',', '').split()
        
        # Amplified matching: check if trigger is IN the word
        neg_hits = sum(1 for w in words if any(t in w for t in self.neg_triggers))
        pos_hits = sum(1 for w in words if any(t in w for t in self.pos_triggers))
        
        # Math fix: multiply by 6 for more drama. 
        # Add a tiny random jitter so the line "vibrates"
        jitter = random.uniform(-0.4, 0.4)
        drift_val = (pos_hits * 6) - (neg_hits * 6) + jitter
        
        # Clamp it between -15 and 15
        drift_val = max(min(drift_val, 15), -15)
        g_force = abs(drift_val)
        
        source = "NEUTRAL_SIGNAL"
        headline = "DATA_STREAM_ACTIVE"
        
        if neg_hits > pos_hits:
            source = "THE_POST_WIRE"
            headline = "MANHUNT: IVY-LEAGUE SUSPECT DISAPPEARS"
        elif pos_hits > neg_hits:
            source = "VOX_CHRONICLE"
            headline = "SYSTEMIC FAILURE: THE MANGIONE PROFILE"
        elif tag == "RESET":
            headline = "BUFFER_PURGED"
            source = "SYSTEM_ADMIN"
            drift_val = 0
            g_force = 0

        self.state = 2 if g_force >= 9 else (1 if g_force > 0 else 0)
        self.history.append(float(drift_val))
        if len(self.history) > 30: self.history.pop(0)

        telemetry = {
            "source": source,
            "headline": headline,
            "state": ["IDLE", "ANALYSIS", "EMERGENCY"][self.state],
            "g_force": round(g_force, 2),
            "drift_val": round(drift_val, 2),
            "history": self.history,
            "raw_input": content,
            "consensus": "SIGNAL STABLE: Luigi Mangione (26). Movement detected: NY to PA." if tag != "RESET" else "SYSTEM_READY",
            "is_locked": self.state == 2,
            "adjective_density": round(((neg_hits + pos_hits) / max(len(words), 1)) * 100, 2)
        }
        
        with open(self.json_path, 'w') as f:
            json.dump(telemetry, f)

def run():
    engine = VeritasBrain()
    print("BRAIN_ONLINE: Monitoring Polarity Drift...")
    while True:
        if os.path.exists("comm_bridge.tmp") and os.path.getsize("comm_bridge.tmp") > 0:
            with open("comm_bridge.tmp", "r") as f:
                data = f.read().strip()
            if data:
                engine.process(data)
                open("comm_bridge.tmp", "w").close()
        time.sleep(0.2)

if __name__ == "__main__":
    run()