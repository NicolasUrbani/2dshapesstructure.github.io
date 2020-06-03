% Read JSON files that contain points and triangles describing the shapes
function shapePart = readJSONParts(path)
    
    fileID = fopen(path,'r');
    
    % 1e ligne : {"points":[
    a = fgets(fileID);

    parts = [];
    res = regexp(a,', ','split');
    
    % Go through the parts
    for i=1:length(res)
        if (i == 1)
            aux = regexp(res{i},'[','split');
            x = str2double(aux{2});
        else
            if (i == length(res))
                aux1 = regexp(res{i},']','split');
                x = str2double(aux1{1});
            else
                x = str2double(res{i});
            end
        end
        parts = [parts ; x];
    end
    
    a = fgets(fileID);
    
    hierarchy = [];
    res1 = regexp(a,', ','split');
    
    % Go through the hierarchy
    for i=1:length(res1)
        if (i == 1)
            aux2 = regexp(res1{i},'[','split');
            x = str2double(aux2{2});
        else
            if (i == length(res1))
                aux3 = regexp(res1{i},']','split');
                x = str2double(aux3{1});
            else
                x = str2double(res1{i});
            end
        end
        hierarchy = [hierarchy ; x];
    end
      
    fclose(fileID);
    
    shapePart.parts = parts;
    shapePart.hierarchy = hierarchy;
end