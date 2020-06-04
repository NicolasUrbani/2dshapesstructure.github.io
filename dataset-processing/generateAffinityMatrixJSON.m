%Generate the JSON files for each shape containing the affinity matrices

dir_path = 'Results/AffinityYvette/';
files = dir(dir_path);

for i=1:size(files,1)
    file = files(i).name;
    if (strcmp(file,'.') == 0 && strcmp(file,'..')==0)
        splitted = split(file, ".");
        shape_name = splitted{1};
        
        load(['Results/AffinityYvette/' file]);
        data = containers.Map();
        data("matrix_with_context") = affinity_matrix_with;
        data("matrix_without_context") = affinity_matrix_without;
        [fileID, errmsg] = fopen(['JSON/AffinityMatrices/' shape_name '.json'],'w');
        if fileID == -1
            disp(errmsg);
        end
        
        json_txt = jsonencode(data);
        fprintf(fileID, json_txt);
        fclose(fileID);
    end
end
