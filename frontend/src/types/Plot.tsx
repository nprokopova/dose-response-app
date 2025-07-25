export type Point = {
    x: number;
    y: number;
};

export type FitResult = {
    points: Point[];
    slope: number;
    intercept: number;
};
