% plot the shape, with one different color per cluster
function displayShapePartsClust(shape, parts, main_parts, cluster)

    [R,G,B] = meshgrid(0:4,0:4,0:4);
    colo = [R(:), G(:), B(:)]/4;
    colo = colo(randperm(125),:);
    
    nbClust = max(cluster);
    
    for p = 1:nbClust
        
        % Get the parts of cluster p
        clust_p_parts = find(cluster == p);
        
        for j = 1:length(clust_p_parts)
            
            tri_part = shape.triangles(parts==clust_p_parts(j)+length(main_parts),:);
        
            for k = 1:size(tri_part,1)
                
                % Get the triangle coordinates
                coord = [shape.points(tri_part(k,1),:) ; 
                shape.points(tri_part(k,2),:) ; 
                shape.points(tri_part(k,3),:)];

                fill(coord(:,1),coord(:,2),colo(p,:),'EdgeColor','None');
                
                hold on;
                axis equal
                axis off
            end

        end
        
%         pause(0.1)
        
    end
    
    for l=1:length(main_parts)
        tri_part1 = shape.triangles(parts==main_parts(l),:);

        for k = 1:size(tri_part1,1)
            % Get the triangle coordinates
            coord = [shape.points(tri_part1(k,1),:) ; 
            shape.points(tri_part1(k,2),:) ; 
            shape.points(tri_part1(k,3),:)];

            fill(coord(:,1),coord(:,2),colo(nbClust+1,:),'EdgeColor','None');
            
            hold on;
            axis equal
            axis off
        end

%         pause(0.1)
    end
    
end