#include <iostream>
#include <fstream>
#include <string>

void send_to_bridge(std::string data) {
    std::ofstream bridge("comm_bridge.tmp");
    if (bridge.is_open()) {
        bridge << data;
        bridge.close();
    }
}

int main() {
    int choice;
    std::cout << "\033[1;31m====================================================\n";
    std::cout << "       PROJECT VERITAS | EXECUTIVE SENTRY      \n";
    std::cout << "====================================================\033[0m\n";

    while (true) {
        std::cout << "\n[1] AUDIT: 'THE SCREAM' (Outrage)\n[2] AUDIT: 'THE CUDDLE' (Sympathy)\n[3] RESET\n[4] EXIT\nVERITAS > ";
        if (!(std::cin >> choice)) break;
        if (choice == 4) break;

        std::string payload = (choice == 1) ? "SCENARIO|The ruthless ivy-league killer vanished with cold-blooded precision." : 
        (choice == 2) ? "SCENARIO|The martyr of a broken system moved like a ghost against greed." : "RESET|Buffer Clear.";
        send_to_bridge(payload);
        std::cout << "\033[1;34m[SENTINEL]: Packet Dispatched.\033[0m\n";
    }
    return 0;
}