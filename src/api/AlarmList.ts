export type AlarmRecord = {
  code       : string,
  severity   : string,
  name       : string,
  target     : string,
  description: string,
  causes     : string
}

export const AlarmList = [

  // Group 1 - Connection
  // Note "1.00" is just an alarm flag that resets automatically when the PLC exchanges a message with the Server, while "1.01" must be quit manualy
  {
    code:        '1.01',
    severity:    'error',
    name:        'SPS⟷Server Verbindung',
    target:      '+U3-25K4 IPC',
    description: 'Der Server meldet keine Verbindung zur SPS',
    causes:      'Anlage ausgeschaltet, Ethernetkabel ausgesteckt, Wackelkontakt, Kabelbruch, defekte Ethernetkarte',
  },
  {
    code:        '1.11',
    severity:    'error',
    name:        'Fehler-Datenübertragung',
    target:      'Server',
    description: 'Der Server meldet keine Verbindung zur SPS',
    causes:      'Anlage ausgeschaltet, Ethernetkabel ausgesteckt, Wackelkontakt, Kabelbruch, defekte Ethernetkarte',
  },

  // Group 2 - PLC
  {
    code:        '2.01',
    severity:    'error',
    name:        'Störmeldung SPS',
    target:      '+U3-25K4 IPC',
    description: 'Die vom Multimeter abgelesenen Werte konnten nicht in die Datenbank übertragen werden',
    causes:      'SPS⟷Server Verbindungsproblem, SPS-Software-Fehler, Server-Software-Fehler',
  },

  // Group 3 - Safety system
  {
    code:        '3.01',
    severity:    'error',
    name:        'Not-Aus gedruckt',
    target:      '+U1-40K2 Sicherheitsrelais',
    description: 'Die Not-Aus Taste wurde gedruckt',
    causes:      '-',
  },

  // Group 4 - Sensors
  {
    code:        '4.01',
    severity:    'error',
    name:        'Signalstörung Lasersensor',
    target:      '+U1-123X1',
    description: 'Das Lasersensorsignal liegt ausserhalb des normalen Betriebsbereichs',
    causes:      'Wackelkontakt, Drahtbruch, defekter Sensor, defektes SPS-Modul',
  },

  // Group 5 - Mechanic/Pneumatic
  {
    code:        '5.01',
    severity:    'error',
    name:        'Luftzylinder Durchgangswiderstand',
    target:      '+Feld-123X1 Luftzylinder',
    description: 'Der Luftzylinder bewegt sich nicht',
    causes:      'Kein/unzureichender Luftdruck, Luftleck, Wackelkontakt, Drahtbruch, Zylinder mechanisch blockiert, defektes Ventil, defektes SPS-Modul, Folgealarm aufgrund eines Problems mit dem Positionssensor',
  },
  {
    code:        '5.02',
    severity:    'error',
    name:        'Luftzylinder grosse Elektroden',
    target:      '+Feld-123X1 Luftzylinder',
    description: 'Der Luftzylinder bewegt sich nicht',
    causes:      'Kein/unzureichender Luftdruck, Luftleck, Wackelkontakt, Drahtbruch, Zylinder mechanisch blockiert, defektes Ventil, defektes SPS-Modul, Folgealarm aufgrund eines Problems mit dem Positionssensor',
  },
  {
    code:        '5.03',
    severity:    'error',
    name:        'Luftzylinder Tisch',
    target:      '+Feld-123X1 Luftzylinder',
    description: 'Der Luftzylinder bewegt sich nicht',
    causes:      'Kein/unzureichender Luftdruck, Luftleck, Wackelkontakt, Drahtbruch, Zylinder mechanisch blockiert, defektes Ventil, defektes SPS-Modul, Folgealarm aufgrund eines Problems mit dem Positionssensor',
  },

  // HMC
  {
    code:        '6.01',
    severity:    'error',
    name:        'Multimeter Kommunikationsfehler',
    target:      '+U1-60B2 Multimeter',
    description: 'Die SPS konnte die Messwerte nicht ablesen.',
    causes:      'SPS Fehlfunktion',
  },
  {
    code:        '6.02',
    severity:    'error',
    name:        'Multimeter nicht erreicht',
    target:      '+U1-60B2 Multimeter',
    description: 'Der Multimeter antwortet nicht.',
    causes:      'Multimeter ausgeschaltet, Ethernetkabel ausgesteckt, Kabelbruch, Wackelkontakt',
  },
  {
    code:        '6.03',
    severity:    'error',
    name:        'Multimeter Einstellungsfehler',
    target:      '+U1-60B2 Multimeter',
    description: 'Der Multimeter konnte nicht richtig eingestellt werden.',
    causes:      'Multimeter Fehlfunktion',
  },

] as AlarmRecord[]
