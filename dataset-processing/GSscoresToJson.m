basicStats

[trie_with, classement_with] = sort(teamscore_with);
[trie_without, classement_without] = sort(teamscore_without);

data = containers.Map;
data("ranking_with") = classement_with;
data("ranking_without") = classement_without;

[fileID, errmsg] = fopen(['JSON/ranking.json'],'w');
json_txt = jsonencode(data);
fprintf(fileID, json_txt);
fclose(fileID);

