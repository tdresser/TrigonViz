import Data.List;
import Data.Maybe;

rotations x = zipWith (++) (tails x) (inits x)

perms x = sort $ nub $ zipWith (\x y -> if y == 0 then x else reverse x)
          (rotations x) (cycle [0,1])

indices = sequence $ take 6 $ repeat [0,1,2]
indicesFiltered = map head $ nub $ map perms indices
indicesToPartition xs = map (\x -> elemIndices x xs) [0,1,2]
partitions = map indicesToPartition indicesFiltered

letters = ["A", "c", "B", "a", "C", "b"];
partitionString = intercalate "\n" $
                  map (\x -> intercalate ":" $ init $
                  map (\y -> intercalate "" $
                  map (\z -> letters !! z) y) x) partitions

main = putStrLn partitionString
