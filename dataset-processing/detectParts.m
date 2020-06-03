function [parts, cuts] = detectParts(shape,annot)

    triangles = shape.triangles;
    cuts = detectCuts(triangles,annot);

    parts = -1 * ones(length(annot),1);
    partId = 1;

    for ind_t = 1:size(triangles,1)
       
        if (parts(ind_t)==-1)
            to_be_visited = ind_t;
            
            % While some triangles should still be visited
            while ~isempty(to_be_visited)
                % Visit the first triangle to be visited
                parts(to_be_visited(1)) = partId;

                % Add its neighbours to the list of triangles to be visited
                neighbours = getNeighbours(to_be_visited(1),triangles,cuts);

                for n = 1:length(neighbours)
                    if (parts(neighbours(n)) == -1)
                        to_be_visited = [to_be_visited neighbours(n)];
                    end
                end

                to_be_visited(to_be_visited == to_be_visited(1)) = [];
                to_be_visited = unique(to_be_visited);
            end

            partId = partId + 1;
        end
        
        
    end
        
    % Reorder parts
    areas_tri = computeTrianglesArea(shape);

    part_area = zeros(1,max(parts));
    part_level = zeros(1,max(parts));
    % For each part, find its level in the hierarchy and its area
    for ind_part = 1:max(parts)
        level = annot(parts==ind_part);
        part_level(ind_part) = str2num(level(1));
        
        part_area(ind_part) = sum(areas_tri(parts==ind_part));     
    end
        
    new_parts_order = [];
    
    order = [0 1 3 2];
    for ind_level = order
        level_areas = part_area(part_level==ind_level);
        ind_part_level = find(part_level == ind_level);
        
        [aux,ind] = sort(level_areas,'descend');
        new_parts_order = [new_parts_order ind_part_level(ind)];
    end
    
    [aux,ind] = sort(new_parts_order,'ascend');
    parts_new = zeros(size(parts));
    for k = 1:max(parts)
       parts_new(parts==k) = ind(k); 
    end
    parts = parts_new;
    
end


function n = getNeighbours(t,triangles,cuts)

    forbidden = [];
    forbidden = [cuts(cuts(:,1)==t,2) ; cuts(cuts(:,2)==t,1)];
    
    n = [];
    for ind_t = 1:size(triangles,1)
        if isNeighbour(triangles(ind_t,:),triangles(t,:)) && sum(forbidden == ind_t) == 0
            n = [n ind_t];
        end
    end

end

function b = isNeighbour(t1,t2)

    nbCommuns = 0;
    for ind_t1 = 1:3
       for ind_t2 = 1:3
           if t1(ind_t1) == t2(ind_t2)
               nbCommuns = nbCommuns + 1;
           end
       end
    end
    if (nbCommuns == 2)
        b = 1;
    else
        b = 0;
    end

end