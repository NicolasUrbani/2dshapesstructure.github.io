function writePartsJSON(parts, hierarchy, shapename)
    
    fileID = fopen(['JSON/Parts/' shapename],'w');

    fprintf(fileID,'{"parts":[');
    for ind_p = 1:length(parts)-1
        fprintf(fileID,[int2str(parts(ind_p)) ', ']);
    end
    fprintf(fileID,[int2str(parts(end)) '],\n']);

    
    fprintf(fileID,' "hierarchy":[');
    for ind_h = 1:length(hierarchy)-1
        fprintf(fileID,[hierarchy(ind_h) ', ']);
    end
    fprintf(fileID,[hierarchy(end) ']\n']);
    
    fprintf(fileID,'}');
    fclose(fileID);

    
end