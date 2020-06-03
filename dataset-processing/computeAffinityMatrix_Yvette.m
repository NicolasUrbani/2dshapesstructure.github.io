% compute the affinity matrix of a shape identified by its ID in the
% Selection table
function [ affinity_matrix_with, affinity_matrix_without, n ] = computeAffinityMatrix_Yvette(idSelection)

    load('userstudy2_1.mat');
    
    % Get the beginning index of idSelection in parts array
    index = 1;  
    while (parts{index,2} ~= idSelection && index < size(parts,1))
        index = index + 1;
    end
    if (parts{index,2} == idSelection)
        i = index;
    else
        i = -1;
    end

    % Compute the affinity matrix with and without context
    if (i ~= -1)
        % Get the IDs of parts of the shape
        partsId = [];
        while (i <= size(parts,1) && parts{i,2} == idSelection)
            partsId = [ partsId ; parts{i,1} ];
            i = i + 1;
        end
        n = size(partsId,1);
        
        partsId
        n
        pause
        
        % Extract all the annotations concerning this shape with and
        % without context
        annotations_with = [];
        annotations_without = [];
        
        fourth_column_with = cell2mat(partsannotationwith(:,4));
        fourth_column_without = cell2mat(partsannotationwithout(:,4));
        
        for j=1:size(partsId,1)
            partsannotationwith_j = partsannotationwith(fourth_column_with == partsId(j),:);
            annotations_with = [ annotations_with ; partsannotationwith_j ];
            
            partsannotationwithout_j = partsannotationwithout(fourth_column_without == partsId(j),:);
            annotations_without = [ annotations_without ; partsannotationwithout_j ];
        end
        
        % affinity matrix
        A = ones(1,n);
        matrix_with = diag(A);
        matrix_without = diag(A);
        
        % annexe matrix with the number of annotations
        nb_samples_with = diag(A);
        nb_samples_without = diag(A);
        
        if (~isempty(annotations_with))
            second_column_with = annotations_with(:,2);
            [ list_teams_with, nb_teams_with ] = cleanArrayString(second_column_with);

            %%% Compute affinity matrix with context
            for k=1:nb_teams_with
                current_team_with = list_teams_with(k);

                % Get all the annotations of the current team
                current_team_annotations_with = annotations_with(strcmp(second_column_with,current_team_with),:);

                % Update the affinity and annexe matrix with this team's annotations
                % Explicit relations
                for l=1:size(current_team_annotations_with,1)
                    line = getIndexInArray(partsId, current_team_annotations_with{l,4});
                    if (current_team_annotations_with{l,5} ~= -1)
                        column = getIndexInArray(partsId, current_team_annotations_with{l,5});
                        if (column ~= -1)
                            matrix_with(line, column) = matrix_with(line, column) + 1;
                            nb_samples_with(line, column) = nb_samples_with(line, column) + 1;
                            matrix_with(column, line) = matrix_with(column, line) + 1;
                            nb_samples_with(column, line) = nb_samples_with(column, line) + 1;
                        end
                    else
                        for col=1:n
                            if (col ~= line)
                                nb_samples_with(line, col) = nb_samples_with(line, col) + 1;
                                nb_samples_with(col, line) = nb_samples_with(col, line) + 1;
                            end
                        end
                    end
                    
                end

                 % Implicit relations
                 % Get the parts annoted by the team
                 fourth_column_with_team = cell2mat(current_team_annotations_with(:,4));
                 list_annoted_parts_with = unique(fourth_column_with_team);
                 nbParts = size(list_annoted_parts_with,1);

                 for m=1:nbParts
                     current_team_annotations_with_m = current_team_annotations_with(fourth_column_with_team == list_annoted_parts_with(m),:);
                     nbAnnot_m = size(current_team_annotations_with_m,1);
                     if (nbAnnot_m > 1)
                         for annot1=1:nbAnnot_m
                             for annot2=annot1+1:nbAnnot_m
                                 line_implicit = getIndexInArray(partsId, current_team_annotations_with_m{annot1,5});
                                 column_implicit = getIndexInArray(partsId, current_team_annotations_with_m{annot2,5});
                                 if (line_implicit ~= -1 && column_implicit ~= -1)
                                    matrix_with(line_implicit, column_implicit) = matrix_with(line_implicit, column_implicit) + 1;
                                    nb_samples_with(line_implicit, column_implicit) = nb_samples_with(line_implicit, column_implicit) + 1;
                                    matrix_with(column_implicit, line_implicit) = matrix_with(column_implicit, line_implicit) + 1;
                                    nb_samples_with(column_implicit, line_implicit) = nb_samples_with(column_implicit, line_implicit) + 1;
                                 end

                             end
                         end
                     end
                 end
            end
            
            % Affinity / nb_samples
            for l=1:n
                for c=1:n
                    if (nb_samples_with(l, c) ~= 0)
                        matrix_with(l, c) = matrix_with(l, c) / nb_samples_with(l, c);
                    else
                        matrix_with(l, c) = 0;
                    end
                end
            end
        else
            for l=1:n
                for c=l+1:n
                    matrix_with(l, c) = 0;
                    matrix_with(c, l) = 0;
                end
            end
        end
        
        if (~isempty(annotations_without))
            second_column_without = annotations_without(:,2);
            [ list_teams_without, nb_teams_without ] = cleanArrayString(second_column_without);

            %%% Compute affinity matrix with context
            for k=1:nb_teams_without
                current_team_without = list_teams_without(k);

                % Get all the annotations of the current team
                current_team_annotations_without = annotations_without(strcmp(second_column_without,current_team_without),:);

                % Update the affinity and annexe matrix with this team's annotations
                % Explicit relations
                for l=1:size(current_team_annotations_without,1)
                    line = getIndexInArray(partsId, current_team_annotations_without{l,4});
                    if (current_team_annotations_without{l,5} ~= -1)
                        column = getIndexInArray(partsId, current_team_annotations_without{l,5});
                        if (column ~= -1)
                            matrix_without(line, column) = matrix_without(line, column) + 1;
                            nb_samples_without(line, column) = nb_samples_without(line, column) + 1;
                            matrix_without(column, line) = matrix_without(column, line) + 1;
                            nb_samples_without(column, line) = nb_samples_without(column, line) + 1;
                        end
                    else
                        for col=1:n
                            if (col ~= line)
                                nb_samples_without(line, col) = nb_samples_without(line, col) + 1;
                                nb_samples_without(col, line) = nb_samples_without(col, line) + 1;
                            end
                        end
                    end
                    
                end

                 % Implicit relations
                 % Get the parts annoted by the team
                 fourth_column_without_team = cell2mat(current_team_annotations_without(:,4));
                 list_annoted_parts_without = unique(fourth_column_without_team);
                 nbParts = size(list_annoted_parts_without,1);

                 for m=1:nbParts
                     current_team_annotations_without_m = current_team_annotations_without(fourth_column_without_team == list_annoted_parts_without(m),:);
                     nbAnnot_m = size(current_team_annotations_without_m,1);
                     if (nbAnnot_m > 1)
                         for annot1=1:nbAnnot_m
                             for annot2=annot1+1:nbAnnot_m
                                 line_implicit = getIndexInArray(partsId, current_team_annotations_without_m{annot1,5});
                                 column_implicit = getIndexInArray(partsId, current_team_annotations_without_m{annot2,5});
                                 if (line_implicit ~= -1 && column_implicit ~= -1)
                                    matrix_without(line_implicit, column_implicit) = matrix_without(line_implicit, column_implicit) + 1;
                                    nb_samples_without(line_implicit, column_implicit) = nb_samples_without(line_implicit, column_implicit) + 1;
                                    matrix_without(column_implicit, line_implicit) = matrix_without(column_implicit, line_implicit) + 1;
                                    nb_samples_without(column_implicit, line_implicit) = nb_samples_without(column_implicit, line_implicit) + 1;
                                 end
                                 
                             end
                         end
                     end
                 end
            end
            
            % Affinity / nb_samples
            for l=1:n
                for c=1:n
                    if (nb_samples_without(l, c) ~= 0)
                        matrix_without(l, c) = matrix_without(l, c) / nb_samples_without(l, c);
                    else
                        matrix_without(l, c) = 0;
                    end
                end
            end
        else
            for l=1:n
                for c=l+1:n
                    matrix_without(l, c) = 0;
                    matrix_without(c, l) = 0;
                end
            end
        end
        
        
    end

    % application of the function (exp(x^2) -1)/(exp(1)-1) 
    % on the affinity matrix
    affinity_matrix_with = (exp(matrix_with .* matrix_with)-1)/(exp(1)-1);
    affinity_matrix_without = (exp(matrix_without .* matrix_without)-1)/(exp(1)-1);
end

% cleanArrayString deletes all duplications of string in an array
% returns the cleanedArray and its length
function [ cleanedArray , n ] = cleanArrayString(array)

    i = 1;
    tab = [];
    tab_aux1 = [];
    while (i <= size(array,1))
        aux = num2str(array{i});
        
        if (ismemberAux([aux], tab_aux1))
            i = i + 1;
        else
            if (i == 1)
                tab = [ tab aux ];
                tab_aux1 = tab';
            else
                tab = [ tab ',' aux ];
                tab_aux1 = (regexp(tab, ',', 'split'))';
            end
            i = i + 1;
        end
    end
    
    tab_aux2 = regexp(tab, ',', 'split');
    
    cleanedArray = tab_aux2';
    n = size(cleanedArray,1);

end

function bool = ismemberAux(element, tab)
    A = ismember(element,tab);
    if (sum(A) ~= size(A,2))
        bool = 0;
    else
        bool = 1;
    end
end

function index = getIndexInArray(array, element)
    i = 1;
    while (i <= size(array,1) && array(i) ~= element)
        i = i + 1;
    end
    
    if (i > size(array,1))
        index = -1;
    else
        index = i;
    end
end