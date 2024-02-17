# Decentralizovaný Peer-to-Peer Chat

Tento projekt implementuje decentralizovaný chatovací systém mezi různými uzly (peery) pomocí UDP, TCP a HTTP protokolů. Každý uzel se může připojit k síti, najít ostatní uzly a komunikovat s nimi prostřednictvím textových zpráv.

## Instalace a Spuštění

1. **Instalace závislostí:**

   - Nainstalujte Node.js a npm z [Node.js stránky](https://nodejs.org/).
   - Naklonujte si tento repozitář na svůj počítač.

2. **Instalace npm balíčků**

   - Přejděte do adresáře projektu a pomocí `npm i` nainstalujte všechny potřebné balíčky

3. **Konfigurace:**

   - Nastavte konfigurační soubor `config.json` podle vašich potřeb.

4. **Spouštění:**

   - Otevřete terminál a přejděte do adresáře s projektem.
   - Spusťte aplikaci pomocí příkazu `npm start`.

5. **Spuštění pomocí service**
   - pokud chcete spustit aplikaci jako service na Debian, vytvořte v `/etc/systemd/system` soubor `chat.service` a upravte jej aby vypadal podle kódu níže, kde nahradíte `user` za uživatele pod kterým chcete spouštět service a `WorkingDirectory` kde použijete cestu k vašemu projektu
   - spusťte příkaz `sudo systemctl daemon-reload`, který znovu načte konfiguraci systémového démona
   - pak můžete použít příkaz `sudo systemctl start chat` pro spuštění a `sudo journalctl -fu chat` k zobrazení logů

**soubor pro konfiguraci _chat.service_:**

```ini
[Unit]
Description=P2P chatting app (2)
After=network.target
[Service]
Type=simple
User=<user>
WorkingDirectory=<path_to_project_folder>
ExecStart=npm start
Restart=always
Environment=NODE_ENV=production
[Install]
WantedBy=multi-user.target
```

## Použití

### 1. UDP Discovery

- Po spuštění aplikace se uzel automaticky připojí k síti a bude pravidelně odesílat UDP Discovery pro objevení ostatních uzlů.
- Odpovědi na tyto dotazy budou obsahovat seznam dostupných uzlů v síti.

### 2. TCP Protokol

- Po nalezení jiných uzlů přes UDP, uzel naváže trvalé TCP spojení s každým z nich a uloží si ho.
- Při navázání spojení provede handshake a obdrží historii zpráv od protějšku.
- Poté může posílat a přijímat zprávy pomocí TCP spojení.
- Zároveň se vytvoří TCP server, který bude naslouchat a na příchozí handshake vrátí všechny svoje zprávy

### 3. Webové API

- Aplikace poskytuje jednoduché HTTP API a rozhraní pro čtení a zasílání zpráv.
- `GET /messages` - vrátí všechny zprávy v json
- `GET /send?message=<text>` - pošle zprávu, kde
- `GET /` - jednoduché rozhraní pro posílání a zobrazení zpráv

## Příklad použití

1. Spusťte aplikaci na každém uzlu v síti.
2. Připojte se k jednomu z uzlů pomocí webového prohlížeče nebo nástroje jako `curl`.
3. Pošlete zprávu na jeden uzel a sledujte, jak se šíří přes ostatní uzly v síti.
4. Prohlížejte si historii zpráv pomocí webového rozhraní nebo API.

## Další Informace

- Projekt je implementován v jazyce Node.js.
- Pro webové API je použit Express.js
- Každý uzel má své unikátní ID, které jde nastavit v config.json jako `my_peer_id`
- Zprávy jsou identifikovány pomocí timestampů.
- Pro ukládání historie zpráv se využívá pole v paměti RAM.
- Aplikace loguje události a chyby pomocí systémového logování.

## Licence

Tento projekt je licencován pod MIT licencí. Podrobnosti naleznete v souboru [LICENSE](LICENSE).
