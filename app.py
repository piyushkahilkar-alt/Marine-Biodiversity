from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # frontend se request allow karne ke liye

# Species DNA Database (backend)
species_db = {
    "Tuna": "ATGGCATGGC",
    "Coral": "CGTAACGTAA",
    "Shark": "GGTCAAGGTC",
    "Dolphin": "TACGGTACGG",
    "Seahorse": "AACCTAACC"
}

def calculate_match(user_dna, species_dna):
    length = min(len(user_dna), len(species_dna))
    match = 0
    for i in range(length):
        if user_dna[i] == species_dna[i]:
            match += 1
    return round((match / len(species_dna)) * 100, 2)

@app.route("/analyze", methods=["POST"])
def analyze_dna():
    data = request.json
    user_dna = data.get("dna", "").upper()

    if not user_dna:
        return jsonify({"error": "No DNA provided"}), 400

    results = []
    for species, dna in species_db.items():
        percent = calculate_match(user_dna, dna)
        results.append({
            "species": species,
            "match_percentage": percent
        })

    best_match = max(results, key=lambda x: x["match_percentage"])

    if best_match["match_percentage"] < 60:
        return jsonify({
            "species": "Unknown",
            "match_percentage": best_match["match_percentage"],
            "all_results": results
        })

    return jsonify({
        "species": best_match["species"],
        "match_percentage": best_match["match_percentage"],
        "all_results": results
    })

if __name__ == "__main__":
    app.run(debug=True)
