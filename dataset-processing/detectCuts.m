function cuts = detectCuts(triangles,annot)

    cuts = [];
    for ind_t = 1:size(triangles,1)-1
        for ind_t2 = ind_t+1:size(triangles,1)
            if (isNeighbour(triangles(ind_t,:),triangles(ind_t2,:)) && annot(ind_t) ~= annot(ind_t2))
%                 cuts = [cuts ; getNeighbouringEdge(triangles(ind_t,:),triangles(ind_t2,:))];
                cuts = [cuts ; ind_t, ind_t2];
            end
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

function edge = getNeighbouringEdge(t1,t2)

	edge = [];
    for ind_t1 = 1:3
       for ind_t2 = 1:3
           if t1(ind_t1) == t2(ind_t2)
               edge = [edge t1(ind_t1)];
           end
       end
    end

end