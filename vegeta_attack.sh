echo "GET https://infinitree.appsdeck.eu" | vegeta attack -rate 20 -duration=60s | tee results.bin | vegeta report
