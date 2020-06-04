% Generate JSON files for each segmentation indincating which parts have
% been selected as similar

%Load data
load("userstudy2-processed.mat");

nb_selections = size(selection, 1);
for i=1:nb_selections
    %Get selection parameters
    id_selection = selection{i,1};
    shapename = selection{i,2};
    shape_selection = selection{i,3};
    
    %HashMap to store the associations
    similarities = containers.Map;
    [fileID, errmsg] = fopen(['JSON/PartsSimilarity/' shapename '_' int2str(shape_selection) '.json'],'w');
    if fileID == -1
        disp(errmsg);
    end
    %Find the partId of the parts in the selection
    partIds = find(parts(:,1) == id_selection);
    globalOffset = min(partIds) - 1;
    for j=1:size(partIds,1)
        %Find all annotations with part j as part1
        annotations = partsannotation(find(partsannotation(:,3)== partIds(j)),:);
        for k=1:size(annotations,1)
            team_id = annotations(k,1);
            ind_part = int2str(partIds(j) +1 - globalOffset);
            ind_team = int2str(team_id);
            if (~isKey(similarities,ind_part))
                similarities(ind_part) = containers.Map;
            end
            part_map = similarities(ind_part);
            
            %Check if there was context
            if (annotations(k,2) ==1 )
                key = "context";
            else
                key ="nocontext";
            end
            
            idPart2 = annotations(k,4);
            if (~isKey(part_map,key))
                part_map(key) = containers.Map;
            end
            tmp = part_map(key);
            if (~(idPart2 == -1))
                
                
                
                
                
                %Check if the two parts are from the same selection
                %If they are, part2 is added to the similarity map
                if (isFromSameSelection(parts, partIds(j), idPart2))
                    if (~isKey(tmp,ind_team))
                        tmp(ind_team) = [];
                    end
                    tmp(ind_team) = [tmp(ind_team) (idPart2-globalOffset)];
                end
            end
            part_map(key) = tmp;
            similarities(ind_part) = part_map;
        end
    end
    
    %Generate the JSON file
    json_txt = jsonencode(similarities);
    json_txt = strrep(json_txt, ',', sprintf(',\r'));
    json_txt = strrep(json_txt, '[{', sprintf('[\r{\r'));
    json_txt = strrep(json_txt, '}]', sprintf('\r}\r]'));
    
    fprintf(fileID,json_txt);
    fclose(fileID);
end