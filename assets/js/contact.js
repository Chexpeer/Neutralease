/* =================================================================
   CONTACT.JS - Formulaire "Décrivez votre besoin" (contact.html)
   Site statique : la demande est préparée dans le courriel du visiteur
   (mailto). Pour un envoi direct, remplacer par un service de formulaire.
   ================================================================ */
(function () {
    'use strict';

    // Adresse de réception des demandes : à renseigner UNE SEULE FOIS, ici.
    var CONTACT_EMAIL = '';

    var form = document.getElementById('needForm');
    if (!form) { return; }
    var status = document.getElementById('formStatus');

    function say(message, isError) {
        status.textContent = message;
        status.className = 'form-status' + (isError ? ' is-error' : '');
    }

    // Préremplissage depuis l'URL : contact.html?profil=professionnel&besoin=maintenance
    var params = new URLSearchParams(window.location.search);
    ['profil', 'besoin'].forEach(function (name) {
        var value = params.get(name);
        var field = form.elements[name];
        if (!value || !field) { return; }
        for (var i = 0; i < field.options.length; i++) {
            if (field.options[i].value === value) { field.value = value; break; }
        }
    });

    function label(name) {
        var field = form.elements[name];
        return field.options ? field.options[field.selectedIndex].text : field.value;
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        if (form.elements.website.value) { return; }          // champ piège (robots)
        if (!form.checkValidity()) { form.reportValidity(); return; }

        if (!CONTACT_EMAIL) {
            say("Le formulaire est en cours d'activation. Merci de réessayer prochainement.", true);
            return;
        }

        var transfer = form.elements.partage.checked ? 'oui' : 'non';
        var subject = '[NeutraLease] Demande : ' + label('besoin');
        var body = [
            'Profil : ' + label('profil'),
            'Besoin : ' + label('besoin'),
            'Délai souhaité : ' + label('delai'),
            '',
            'Description :',
            form.elements.message.value.trim(),
            '',
            'Nom : ' + form.elements.nom.value.trim(),
            'Structure : ' + form.elements.structure.value.trim(),
            'Code postal : ' + form.elements.codepostal.value.trim(),
            'Recontact souhaité : ' + label('recontact'),
            'Courriel : ' + form.elements.email.value.trim(),
            'Téléphone : ' + form.elements.telephone.value.trim(),
            '',
            'Accord de transmission à des partenaires : ' + transfer
        ].join('\n');

        window.location.href = 'mailto:' + CONTACT_EMAIL +
            '?subject=' + encodeURIComponent(subject) +
            '&body=' + encodeURIComponent(body);
        say("Votre messagerie s'ouvre avec votre demande. Il ne reste qu'à l'envoyer.", false);
    });
})();
