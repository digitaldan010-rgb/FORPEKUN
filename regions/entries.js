// Raffle entries. Add one line per ticket under the right region.
// The reel shows the first 8 digits of the IMEI, then the winner pops up.
// These are sample entries: replace them with your real list.
window.REGIONS = {
  "abuja":         { name: "Abuja",         code: "AB" },
  "ibadan":        { name: "Ibadan",        code: "IB" },
  "kano-kaduna":   { name: "Kano / Kaduna", code: "KN/KD" },
  "lagos":         { name: "Lagos",         code: "LA" },
  "onitsha":       { name: "Onitsha",       code: "ON" },
  "port-harcourt": { name: "Port Harcourt", code: "PH" },
};

window.ENTRIES = {
  "abuja": [
    { name: "Sample Entrant A1", address: "Wuse 2, Abuja", phone: "08000000001", prize: "D.Smart 20", imei: "351234567890121" },
    { name: "Sample Entrant A2", address: "Garki, Abuja",  phone: "08000000002", prize: "D.Smart 20", imei: "352345678901232" },
  ],
  "ibadan": [
    { name: "Sample Entrant I1", address: "Bodija, Ibadan", phone: "08000000003", prize: "D.Smart 20", imei: "353456789012343" },
    { name: "Sample Entrant I2", address: "Ring Road, Ibadan", phone: "08000000004", prize: "D.Smart 20", imei: "354567890123454" },
  ],
  "kano-kaduna": [
    { name: "Sample Entrant K1", address: "Sabon Gari, Kano", phone: "08000000005", prize: "D.Smart 20", imei: "355678901234565" },
    { name: "Sample Entrant K2", address: "Barnawa, Kaduna",  phone: "08000000006", prize: "D.Smart 20", imei: "356789012345676" },
  ],
  "lagos": [
    { name: "Sample Entrant L1", address: "Ikeja, Lagos", phone: "08000000007", prize: "D.Smart 20", imei: "357890123456787" },
    { name: "Sample Entrant L2", address: "Lekki, Lagos", phone: "08000000008", prize: "D.Smart 20", imei: "358901234567898" },
  ],
  "onitsha": [
    { name: "Sample Entrant O1", address: "Main Market, Onitsha", phone: "08000000009", prize: "D.Smart 20", imei: "359012345678909" },
    { name: "Sample Entrant O2", address: "Fegge, Onitsha",       phone: "08000000010", prize: "D.Smart 20", imei: "350123456789010" },
  ],
  "port-harcourt": [
    { name: "Sample Entrant P1", address: "GRA, Port Harcourt",       phone: "08000000011", prize: "D.Smart 20", imei: "359474400000011" },
    { name: "Sample Entrant P2", address: "Trans Amadi, Port Harcourt", phone: "08000000012", prize: "D.Smart 20", imei: "359474400000022" },
  ],
};
