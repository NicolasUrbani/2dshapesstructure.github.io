% plot the shape, with one different color per parts
function displayShapeParts(shape,parts)

    [R,G,B] = meshgrid(0:4,0:4,0:4);
    colo = [R(:), G(:), B(:)]/4;
    colo = colo(randperm(125),:);
    
    
    for p = 1:max(parts)
        
        tri_part = shape.triangles(parts==p,:);
        
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
        
%         pause(0.1)
        
    end
    
    
    

end