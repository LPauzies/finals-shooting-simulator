class ShooterModel {

    static SHOOTER_NUMBER = 8;

}

class ShooterResult {

    public readonly name: string;
    status: string;
    total: number;
    rank?: number;
    scores: number[];

    constructor(name: string, status: string) {
        this.name = name;
        this.status = status;
        this.total = 0;
        this.scores = new Array(24);
    }

    // I/O

    getScoreForAShoot(shootCount: number) {
        return this.scores[shootCount];
    }

    setScoreForAShoot(score: number, shootCount: number) {
        this.scores[shootCount] = score;
    }

    getRank() {
        return this.rank;
    }

    setRank(rank: number) {
        this.rank = rank;
    }

    // Functions

    computeTotal() {
        let total = this.scores.reduce((acc, e) => acc + e, 0);
        this.total = Math.round(total * 10) / 10;
    }

}

export { ShooterModel, ShooterResult }