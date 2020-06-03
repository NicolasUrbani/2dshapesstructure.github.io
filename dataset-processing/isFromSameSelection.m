function result = isFromSameSelection(parts, idPart1, idPart2)

part1 = parts(idPart1,:);
part2 = parts(idPart2,:);

result = (part1(1) == part2(1));


end