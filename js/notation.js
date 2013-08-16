NOTATION = {
    // Basic movements - start and end holding two balls
    "RotateRight":"A:B C:A",
    "PivotRight":"A:B C:B",
    "RotateLeft":"A:B B:C",
    "PivotLeft":"A:B A:C",
    "Switch":"A:B B:A",
    "Same":"A:B A:B",

    // Simple composites
    "Cascade":"PivotRight*",
    "423":"PivotRight PivotRight*",
    "Box":"RotateRight*",

    // Basic dual movements - start and end holding two strings
    "DualRotateRight":"a:b c:a",
    "DualPivotRight":"a:b c:b",
    "DualRotateLeft":"a:b b:c",
    "DualPivotLeft":"a:b a:c",
    "DualSwitch":"a:b b:a",
    "DualSame":"a:b a:b",

    // Simple dual composites
    "DualCascade":"DualPivotRight*",
    "DualShowerRight":"DualRotateRight DualRotateRight DualRotateRight",
    "DualShowerLeft":"DualRotateLeft DualRotateLeft DualRotateLeft",
    "Dual423":"DualPivotRight DualPivotRight*",

    // Switching between balls and strings.
    "HalfRotateRight":"A:B b:c",
    "DualHalfRotateRight":"a:b B:C",
    "HalfRotateLeft":"A:B c:a",
    "HalfRotateLeft":"a:b C:A",
    "MultiCascade":"A:B A:b C:b C:B*",
}
