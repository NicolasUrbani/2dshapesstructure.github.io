clear all;
load("userstudy2_1.mat");

parts_map = containers.Map;
parts_map("idPart") = parts(:,1);
parts_map("idSelection") = parts(:,2);
parts_map("part") = parts(:,3);
parts_map("countwith") = parts(:,4);
parts_map("countwithout") = parts(:,5);

partsannotationwith_map = containers.Map;
partsannotationwith_map("annotationId") = partsannotationwith(:,1);
partsannotationwith_map("team") = partsannotationwith(:,2);
partsannotationwith_map("context") = partsannotationwith(:,3);
partsannotationwith_map("idPart1") = partsannotationwith(:,4);
partsannotationwith_map("idPart2") = partsannotationwith(:,1);

partsannotationwithout_map = containers.Map;
partsannotationwithout_map("annotationId") = partsannotationwithout(:,1);
partsannotationwithout_map("team") = partsannotationwithout(:,2);
partsannotationwithout_map("context") = partsannotationwithout(:,3);
partsannotationwithout_map("idPart1") = partsannotationwithout(:,4);
partsannotationwithout_map("idPart2") = partsannotationwithout(:,1);

selection_map = containers.Map;
selection_map("idSelection") = selection(:,1);
selection_map("name") = selection(:,2);
selection_map("selection") = selection(:,3);


data = containers.Map;
data("parts") = parts_map;
data("partsannotationwith") = partsannotationwith_map;
data("partsannotationwithout") = partsannotationwithout_map;
data("selection") = selection_map;


[fileID, errmsg] = fopen('JSON/DataDump/dump.json','w');
json_txt = jsonencode(data);
fprintf(fileID,json_txt);
fclose(fileID);